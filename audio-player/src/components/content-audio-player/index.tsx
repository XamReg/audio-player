"use client";

import { IContentAudioPlayer } from "@kp/data";
import "./styles.css";
import { useRef, useState } from "react";
import { AudioPlayer } from "./components/audio-player";
import { RowAudio } from "./components/row-audio";
import { IActiveAudio } from "./types";

export function ContentAudioPlayer({
  items,
  title,
  description,
  cover,
}: IContentAudioPlayer) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [activeAudio, setActiveAudio] = useState<IActiveAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  return (
    <section className="content-audio-player">
      <AudioPlayer
        setIsPlaying={setIsPlaying}
        setActiveAudio={setActiveAudio}
        title={title}
        description={description}
        isPlaying={isPlaying}
        activeAudio={activeAudio}
        cover={cover}
        audioRef={audioRef}
        items={items}
        setCurrentTime={setCurrentTime}
        currentTime={currentTime}
        setDuration={setDuration}
        duration={duration}
      />
      <RowAudio
        activeAudio={activeAudio}
        setActiveAudio={setActiveAudio}
        items={items}
        isPlaying={isPlaying}
      />
    </section>
  );
}
