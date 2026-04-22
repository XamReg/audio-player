import Icon from "@ant-design/icons";
import { Button, Tooltip, Slider, SliderSingleProps } from "antd";
import { useRef } from "react";
import { ISoundButton } from "../../types";
import { SoundIcon, OffSoundIcon, MiddleSoundIcon } from "../icons";
import "./styles.css";

const stylesObject: SliderSingleProps["styles"] = {
  rail: { backgroundColor: "var(--ant-kpbrandsecondary-4)" },
  track: {
    backgroundImage: "var(--ant-color-primary)",
    backgroundColor: "var(--ant-color-primary)",
  },
};

export const SoundButton = ({
  activeAudio,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
}: ISoundButton) => {
  const lastVolumeRef = useRef<number>(volume > 0 ? volume : 1);

  const toggleMute = () => {
    setIsMuted((prev: boolean) => {
      const next = !prev;
      if (next && volume > 0) {
        lastVolumeRef.current = volume;
      } else if (!next && volume === 0) {
        setVolume(lastVolumeRef.current || 1);
      }
      return next;
    });
  };

  const handleVolumeChange = (e: number) => {
    const value = Number(e);
    setVolume(value);
    if (value > 0) lastVolumeRef.current = value;
    if (value === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  return (
    <Tooltip
      arrow={false}
      open={activeAudio === null ? false : undefined}
      color="var(--ant-kp-color-text-invert)"
      classNames={{ root: "tooltip-hide-mobile" }}
      title={
        <Slider
          styles={stylesObject}
          style={{ touchAction: "none" }}
          max={1}
          step={0.1}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          tooltip={{ formatter: null }}
          className="slider-sound"
          vertical
        />
      }
    >
      <Button
        onClick={toggleMute}
        type="text"
        className="button-sound"
        icon={
          <Icon
            component={
              isMuted
                ? OffSoundIcon
                : volume > 0.5
                  ? SoundIcon
                  : MiddleSoundIcon
            }
          />
        }
      />
    </Tooltip>
  );
};
