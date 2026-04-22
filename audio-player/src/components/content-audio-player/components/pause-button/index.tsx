import { Button } from "antd";
import { IActiveAudio, IPauseButton } from "../../types";
import { PauseIcon, PlayIcon } from "../icons";
import "./styles.css";

export const PauseButton = ({
  togglePlay,
  isPlaying,
  setActiveAudio,
  activeAudio,
  items,
}: IPauseButton) => {
  const switchButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (activeAudio) {
      togglePlay();
      return;
    }
    const checkId = `${items[0]?.file?.key}-${0}`;
    const rowParams = {
      ...items[0],
      index: 0,
      idAudio: checkId,
    };

    setActiveAudio(() => rowParams as IActiveAudio);
  };

  return (
    <Button
      onClick={switchButton}
      className="pause-button"
      size="large"
      icon={!isPlaying ? <PlayIcon /> : <PauseIcon />}
    />
  );
};
