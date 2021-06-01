import React, { useLayoutEffect } from "react";

const Iframe: React.FC<{ className: string; src: string; id: string }> = ({
  className,
  src,
  id,
}) => {
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

  return <iframe className={className} src={src} allowFullScreen id={id} />;
};

export default Iframe;
