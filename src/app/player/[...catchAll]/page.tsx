"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const PlayerPage = () => {
  const router = useRouter();
  const player = useRef<HTMLVideoElement>(null);

  return (
    <>
      <div
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-white flex gap-2 items-center justify-center"
      >
        <ArrowLeftIcon className="flex-grow-0 h-8 w-8" />
        <span className="font-bold text-xl">Powrót</span>
      </div>
      <video
        ref={player}
        className="w-svw h-svh pointer-events-none"
        title="CineEdi Player"
        preload="none"
        typeof="video/mp4"
        src="/nggyu.mp4"
        autoPlay={true}
        loop={true}
        autoFocus={true}
        muted={false}
        controls={false}
        onLoad={() => player.current?.play()}
      ></video>
    </>
  );
};

export default PlayerPage;
