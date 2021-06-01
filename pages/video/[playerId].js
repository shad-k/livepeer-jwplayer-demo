import React, { useLayoutEffect } from "react";
import { useRouter } from "next/router";

const VideoPage = () => {
  const router = useRouter();
  const { playerId } = router.query;

  const adjustIframe = (player) => {
    const windowWidth = window.innerWidth;

    if (windowWidth > 1280 && windowWidth < 1536) {
      player.style.height = "430px";
    } else if (windowWidth > 1024 && windowWidth < 1280) {
      player.style.height = "580px";
    } else if (windowWidth < 1024) {
      player.style.height = "430px";
    } else {
      player.style.height = "520px";
    }
  };

  useLayoutEffect(() => {
    let interval;
    const player = document.getElementById("player");
    if (player) {
      adjustIframe(player);
    } else {
      interval = setInterval(() => {
        const player = document.getElementById("player");
        if (player) {
          adjustIframe(player);
          clearInterval(interval);
        }
      }, 1000);
    }

    () => {
      if (interval) clearInterval(interval);
    };
  }, []);

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
      <div className="container flex flex-col items-center w-full xl:w-3/5 m-auto justify-center pb-12">
        {playerId && (
          <iframe
            className="w-full bg-black"
            src={`https://cdn.jwplayer.com/players/${playerId}.html`}
            allowFullScreen
            id="player"
          />
        )}
      </div>
      <footer className="w-full h-12 flex items-center justify-center">
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
