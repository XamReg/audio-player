import { Flex } from "antd";
import { clsx } from "clsx";

import "./styles.css";

export interface ICirclePulsing {
  isActive: boolean;
  isPlay: boolean;
}

export const CirclePulsing = ({ isActive, isPlay }: ICirclePulsing) => {
  return (
    <Flex
      data-active={isActive ? "active" : "inactive"}
      className={clsx("circle-pulsing", isPlay && "active-row")}
    >
      <svg width="90" height="90" viewBox="0 0 90 90">
        {isPlay && <circle id="ring" r="45" cx="45" cy="45" fill="#01a4e9" />}
        <circle id="dot" r="8" cx="45" cy="45" fill="#FFF" />
      </svg>
    </Flex>
  );
};
