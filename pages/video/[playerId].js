import React from "react";
import { useRouter } from "next/router";

const VideoPage = () => {
  const router = useRouter();
  const { playerId } = router.query;

  return (
    <main className="container pb-12 h-screen m-auto pt-24 lg:pt-40">
      <header className="w-full p-3 flex justify-between items-center fixed top-0 left-0 z-10 bg-white">
        <a
          href="https://livepeer.com/docs/"
          target="_blank"
          rel="noopener, nofollow"
          className="logo flex flex-col flex-1 lg:w-1/5"
        >
          <h1 className="font-bold text-xl">Livepeer.com API Demo</h1>
        </a>

        <button
          className="border p-2 h-1/2 rounded border-livepeer hover:bg-livepeer hover:text-white"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </header>
      <div className="w-11/12 h-full m-auto">
        {playerId && (
          <iframe
            className="w-full h-full"
            src={`https://cdn.jwplayer.com/players/${playerId}.html`}
            allowFullScreen
          />
        )}
      </div>
      <footer className="fixed bottom-0 left-0 w-full h-12 flex items-center justify-center">
        Made with the&nbsp;
        <a href="https://livepeer.com/docs/" className="text-livepeer text-xl">
          Livepeer.com
        </a>
        &nbsp;API
      </footer>
    </main>
  );
};

export default VideoPage;
