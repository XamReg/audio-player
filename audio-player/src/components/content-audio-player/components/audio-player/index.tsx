"use client";

import Icon, {
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";

import { environment } from "@sp/data";
import { getImageSrc } from "@sp/shared";
import { Flex, Button, Slider, SliderSingleProps } from "antd";
import "./styles.css";
import { clsx } from "clsx";
import {
  SyntheticEvent,
  useEffect,
  useState,
  MouseEvent,
  useCallback,
  useRef,
} from "react";
import { Typography } from "../../../typography";
import {
  IActiveAudio,
  IAudioPlayer,
  MediaSessionActionDetails,
} from "../../types";
import { PauseButton } from "../pause-button";
import { SoundButton } from "../sound-button";

const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
};

const optionsImg = {
  width: 628,
  height: 468,
  fit: "cover" as const,
};

const stylesObject: SliderSingleProps["styles"] = {
  rail: { backgroundColor: "var(--ant-brandsecondary-4)" },
  track: {
    backgroundImage: "var(--ant-color-primary)",
    backgroundColor: "var(--ant-color-primary)",
  },
};

export function AudioPlayer({
  setIsPlaying,
  isPlaying,
  setActiveAudio,
  activeAudio,
  cover,
  audioRef,
  title,
  description,
  items,
  setCurrentTime,
  currentTime,
  setDuration,
  duration,
}: IAudioPlayer) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number>(1);
  const isMutedRef = useRef<boolean>(false);
  const { Text, Title } = Typography;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Audio play error:", err);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // next/prev (useCallback чтобы deps у MediaSession были корректные)
  const nextSound = useCallback(
    (e?: SyntheticEvent<HTMLAudioElement, Event> | MouseEvent<HTMLElement>) => {
      e?.stopPropagation?.();
      if (!activeAudio) return;

      const nextIndex = activeAudio.index + 1;
      const rowParams: IActiveAudio | object = {};

      if (items.length === nextIndex) {
        const checkId = `${items[0]?.file?.key}-0`;
        Object.assign(rowParams, {
          ...items[0],
          index: 0,
          idAudio: checkId,
        });
      } else {
        const checkId = `${items[nextIndex]?.file?.key}-${nextIndex}`;
        Object.assign(rowParams, {
          ...items[nextIndex],
          index: nextIndex,
          idAudio: checkId,
        });
      }

      setActiveAudio(rowParams as IActiveAudio);
    },
    [activeAudio, items, setActiveAudio],
  );

  const prevSound = useCallback(
    (e?: SyntheticEvent<HTMLAudioElement, Event> | MouseEvent<HTMLElement>) => {
      e?.stopPropagation?.();
      if (!activeAudio) return;

      const prevIndex = activeAudio.index - 1;
      const lastIndex = items.length - 1;
      const rowParams: IActiveAudio | object = {};

      if (prevIndex < 0) {
        const checkId = `${items[lastIndex]?.file?.key}-${lastIndex}`;
        Object.assign(rowParams, {
          ...items[lastIndex],
          index: lastIndex,
          idAudio: checkId,
        });
      } else {
        const checkId = `${items[prevIndex]?.file?.key}-${prevIndex}`;
        Object.assign(rowParams, {
          ...items[prevIndex],
          index: prevIndex,
          idAudio: checkId,
        });
      }

      setActiveAudio(rowParams as IActiveAudio);
    },
    [activeAudio, items, setActiveAudio],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeAudio) return;

    audio.currentTime = 0;
    audio.load();
    audio.muted = isMutedRef.current;

    const play = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio play error:", error);
        setIsPlaying(false);
      }
    };

    play();
  }, [activeAudio, audioRef, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // iOS Safari ignores volume changes; use muted to actually silence.
    const prevTime = audio.currentTime;
    audio.muted = isMuted;
    if (!isMuted) {
      audio.volume = volume;
    }
    if (
      Number.isFinite(prevTime) &&
      Math.abs(audio.currentTime - prevTime) > 0.05
    ) {
      audio.currentTime = prevTime;
    }
  }, [volume, isMuted, audioRef]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime || 0);
  };

  const handleEnded = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    setIsPlaying(false);
    nextSound(e);
  };

  useEffect(() => {
    if (!activeAudio || items.length === 0) return;

    const nextIndex =
      activeAudio.index + 1 >= items.length ? 0 : activeAudio.index + 1;
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    const nextSrc = getImageSrc(environment.assetsUrl, nextItem.file.key);

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "audio";
    link.href = nextSrc;

    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [activeAudio, items]);

  // === Media Session API (виджет/локскрин/гарнитура) ===
  useEffect(() => {
    if (!activeAudio) return;
    if (typeof window === "undefined") return;

    const navAny = navigator as Navigator;
    if (!navAny.mediaSession) return;
    if (
      typeof (window as Window & typeof globalThis).MediaMetadata ===
      "undefined"
    )
      return;

    const artworkUrl = getImageSrc(
      environment.assetsUrl,
      activeAudio.cover.key,
      optionsImg,
    );

    navAny.mediaSession.metadata = new (
      window as Window & typeof globalThis
    ).MediaMetadata({
      title: title ?? "",
      artist: "",
      album: "",
      artwork: [
        { src: artworkUrl, sizes: "96x96", type: "image/png" },
        { src: artworkUrl, sizes: "128x128", type: "image/png" },
        { src: artworkUrl, sizes: "192x192", type: "image/png" },
        { src: artworkUrl, sizes: "256x256", type: "image/png" },
        { src: artworkUrl, sizes: "512x512", type: "image/png" },
      ],
    });

    navAny.mediaSession.setActionHandler("play", () => {
      const a = audioRef.current;
      if (!a) return;
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    });

    navAny.mediaSession.setActionHandler("pause", () => {
      const a = audioRef.current;
      if (!a) return;
      a.pause();
      setIsPlaying(false);
    });

    navAny.mediaSession.setActionHandler("nexttrack", () => nextSound());
    navAny.mediaSession.setActionHandler("previoustrack", () => prevSound());

    navAny.mediaSession.setActionHandler(
      "seekto",
      (details: MediaSessionActionDetails) => {
        const a = audioRef.current;
        if (!a) return;
        if (typeof details?.seekTime === "number") {
          a.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      },
    );

    return () => {
      try {
        navAny.mediaSession.setActionHandler("play", null);
        navAny.mediaSession.setActionHandler("pause", null);
        navAny.mediaSession.setActionHandler("nexttrack", null);
        navAny.mediaSession.setActionHandler("previoustrack", null);
        navAny.mediaSession.setActionHandler("seekto", null);
      } catch {
        // ignore: MediaSession cleanup not supported
      }
    };
  }, [
    activeAudio,
    title,
    audioRef,
    setIsPlaying,
    setCurrentTime,
    nextSound,
    prevSound,
  ]);

  // Синхронизация play/pause для системного UI
  useEffect(() => {
    if (!navigator.mediaSession) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  return (
    <Flex className="audio-player">
      <Flex className="block-hidden">
        {activeAudio === null ? (
          <img
            className="image-audio"
            src={getImageSrc(environment.assetsUrl, cover.id, optionsImg)}
          />
        ) : (
          <>
            <img
              className="image-audio"
              src={getImageSrc(
                environment.assetsUrl,
                activeAudio.cover.key,
                optionsImg,
              )}
            />
            <audio
              ref={audioRef}
              preload="auto"
              src={getImageSrc(environment.assetsUrl, activeAudio.file.key)}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          </>
        )}

        <Flex vertical className="control-unit">
          <Flex
            className={clsx("block-title", activeAudio && "hidden-block-title")}
            align="center"
            vertical
            gap={"var(--ant-margin)"}
          >
            <Title type="SolidDark" level={2}>
              {title}
            </Title>
            {description && <Text type="SolidDark">{description}</Text>}
          </Flex>

          <Flex className="block-button-step">
            <Button
              size="large"
              className={clsx("button-next", activeAudio && "show-button")}
              icon={<Icon component={StepBackwardOutlined} />}
              type="text"
              onClick={prevSound}
            />

            <PauseButton
              togglePlay={togglePlay}
              setActiveAudio={setActiveAudio}
              isPlaying={isPlaying}
              activeAudio={activeAudio}
              items={items}
            />

            <Button
              size="large"
              className={clsx("button-next", activeAudio && "show-button")}
              icon={<Icon component={StepForwardOutlined} />}
              type="text"
              onClick={nextSound}
            />
          </Flex>

          <Flex className={clsx("block-slider", activeAudio && "show-slider")}>
            <Text type="SolidLight" disabled className="size-lg">
              {formatTime(currentTime)}
            </Text>

            <Slider
              styles={stylesObject}
              style={{ touchAction: "none" }}
              value={currentTime || 0}
              tooltip={{ formatter: null }}
              className="slider-audio"
              defaultValue={30}
              onChange={handleSeek}
              step={0.1}
              min={0}
              max={duration || 0}
            />

            <Text type="SolidLight" disabled className="size-lg">
              {formatTime(duration)}
            </Text>

            <SoundButton
              activeAudio={activeAudio}
              setVolume={setVolume}
              volume={volume}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
