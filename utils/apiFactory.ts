import axios from "axios";

const apiInstance = axios.create({
  baseURL: "/api/",
  timeout: 10000,
});

export const createStream = (
  apiKey: string,
  jwPlayerAPIKey: string,
  jwPlayerSecret: string,
  streamTitle: string
): Promise<any> => {
  return apiInstance.post(
    "/stream",
    {
      name: streamTitle,
      profiles: [
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720,
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480,
        },
        {
          name: "360p",
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360,
        },
      ],
    },
    {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "x-jwplayer-key": jwPlayerAPIKey,
        "x-jwplayer-secret": jwPlayerSecret,
      },
    }
  );
};

export const getStreamStatus = (
  apiKey: string,
  streamId: string
): Promise<any> => {
  return apiInstance.get(`/stream/${streamId}`, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
  });
};
