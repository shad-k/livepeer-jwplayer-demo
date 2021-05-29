import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const VideoPage = () => {
  const router = useRouter();
  const { playerId } = router.query;

  return (
    <div className="w-screen h-screen">
      {playerId && (
        <iframe
          className="w-full h-full"
          src={`https://cdn.jwplayer.com/players/${playerId}.html`}
          allowFullScreen
        />
      )}
    </div>
  );
};

export default VideoPage;
