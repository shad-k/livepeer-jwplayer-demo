import axios from "axios";
import crypto from "crypto";
import { URL } from "url";

// Creates a signature required by the JWPlayer API to sign each request.
const getSignatureForJWPlayerAPI = (
  key,
  secret,
  nonce,
  timestamp,
  playbackURL = null,
  streamName = ""
) => {
  var shasum = crypto.createHash("sha1");
  let paramsToText = `api_format=json&api_key=${key.toString()}&api_nonce=${nonce}&api_timestamp=${timestamp.toString()}`;
  if (playbackURL) {
    paramsToText += `&sourceformat=m3u8&sourcetype=url&sourceurl=${encodeURIComponent(
      playbackURL
    )}&tags=Livepeer&title=${encodeURIComponent(streamName)}`;
  }
  paramsToText += secret;
  shasum.update(paramsToText);
  return shasum.digest("hex");
};

// Generates a random 8 digit nonce to be sent in JWPlayer API requests.
const getNonce = (length) => {
  var nonce = "";
  var possible = "0123456789";
  for (var i = 0; i < length; i++) {
    nonce += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return nonce;
};

const makeCreateRequest = async (
  streamName,
  streamProfiles,
  authorizationHeader
) => {
  return await axios.post(
    "https://livepeer.com/api/stream",
    {
      name: streamName,
      profiles: streamProfiles,
    },
    {
      headers: {
        "content-type": "application/json",
        authorization: authorizationHeader, // API Key needs to be passed as a header
      },
    }
  );
};

// Gets all available players on JWPlayer and uses the first. If none exists it creates a new player.
const getAvailablePlayers = async (key, secret) => {
  const nonce = getNonce(8);
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const signature = getSignatureForJWPlayerAPI(key, secret, nonce, timestamp);
  const requestURL = new URL(
    `https://api.jwplatform.com/v1/players/list?api_format=json&api_nonce=${nonce}&api_timestamp=${timestamp}&api_signature=${signature}&api_key=${key}`
  );
  const playersListResponse = await axios.get(requestURL.toString());
  if (playersListResponse && playersListResponse.data) {
    if (playersListResponse.data.players.length > 0) {
      return playersListResponse.data.players[0];
    } else {
      const nonce = getNonce(8);
      const timestamp = Math.floor(new Date().getTime() / 1000);
      const signature = getSignatureForJWPlayerAPI(
        key,
        secret,
        nonce,
        timestamp
      );
      const requestURL = new URL(
        `https://api.jwplatform.com/v1/players/create?api_format=json&api_nonce=${nonce}&api_timestamp=${timestamp}&api_signature=${signature}&api_key=${key}`
      );
      const createPlayerResponse = await axios.post(requestURL.toString());
      if (createPlayerResponse && createPlayerResponse.data) {
        return createPlayerResponse.data.player;
      } else {
        throw new Error(
          "Something went wrong while creating a JWPlayer player"
        );
      }
    }
  } else {
    throw new Error("Something went wrong while fetching available players");
  }
};

// Registers the video on JWPlayer. This is required to track video analytics.
const createVideoOnJWPlayer = async (key, secret, playbackURL, streamName) => {
  const nonce = getNonce(8);
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const signature = getSignatureForJWPlayerAPI(
    key,
    secret,
    nonce,
    timestamp,
    playbackURL,
    streamName
  );
  const requestURL = new URL(
    `https://api.jwplatform.com/v1/videos/create?api_format=json&api_nonce=${nonce}&api_timestamp=${timestamp}&api_signature=${signature}&api_key=${key}&sourceformat=m3u8&sourcetype=url&sourceurl=${playbackURL}&tags=Livepeer&title=${encodeURIComponent(
      streamName
    )}`
  );
  const createVideoResponse = await axios.post(requestURL.toString());
  if (createVideoResponse && createVideoResponse.data) {
    return createVideoResponse.data;
  } else {
    throw new Error("Something went wrong while registering video on JWPlayer");
  }
};

/**
 * calls the /stream route of Livepeer.com APIs to create a new stream.
 * The response returns the playbackId and streamKey.
 * With this data available the ingest and playback urls would respectively be:
 * Ingest URL: rtmp://rtmp.livepeer.com/live/{stream-key}
 * Playback URL: https://cdn.livepeer.com/hls/{playbackId}/index.m3u8
 * Also, connects to JWPlayer API to get the available players.
 * Using the player data and the stream data registers the video on JWPlayer
 */
export default async (req, res) => {
  if (req.method === "POST") {
    const authorizationHeader = req.headers && req.headers["authorization"];
    const jwPlayerAPIKey = req.headers && req.headers["x-jwplayer-key"];
    const jwPlayerSecret = req.headers && req.headers["x-jwplayer-secret"];
    const streamName = req.body && req.body.name;
    const streamProfiles = req.body && req.body.profiles;

    if (!authorizationHeader || !jwPlayerAPIKey || !jwPlayerSecret) {
      res.statusCode = 500;
      res.json({ error: "API credentials not found" });
    }

    try {
      const [
        createStreamResponse,
        availablePlayersResponse,
      ] = await Promise.all([
        makeCreateRequest(streamName, streamProfiles, authorizationHeader),
        getAvailablePlayers(jwPlayerAPIKey, jwPlayerSecret),
      ]);
      if (createStreamResponse && createStreamResponse.data) {
        const createVideoOnJWPlayerResponse = await createVideoOnJWPlayer(
          jwPlayerAPIKey,
          jwPlayerSecret,
          `https://cdn.livepeer.com/hls/${createStreamResponse.data.playbackId}/index.m3u8`,
          streamName
        );

        const videoKey = createVideoOnJWPlayerResponse.video.key;
        const playerKey = availablePlayersResponse.key;
        const jwPlayerHostedLibraryLink = `https://cdn.jwplayer.com/players/${videoKey}-${playerKey}.js`;
        const divKey = `${videoKey}_${playerKey}`;

        res.statusCode = 200;
        res.json({
          ...createStreamResponse.data,
          jwPlayerHostedLibraryLink,
          divKey,
        });
      } else {
        res.statusCode = 500;
        res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      res.statusCode = 500;
      console.log(error);
      // Handles Invalid API key error
      if (error.response && error.response.status === 403) {
        res.statusCode = 403;
      }
      res.json({ error });
    }
  }
};
