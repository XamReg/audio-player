"use client";

import { environment } from "@sp/data";
import { getImageSrc } from "@sp/shared";

import { Flex } from "antd";
import "./styles.css";
import { clsx } from "clsx";
import { Typography } from "../../../typography";
import { IItems, IRowAudio } from "../../types";
import { CirclePulsing } from "../circle-pulsing";

const optionsImg = {
  width: 64,
  height: 64,
  fit: "cover" as const,
};

export function RowAudio({
  activeAudio,
  setActiveAudio,
  items,
  isPlaying,
}: IRowAudio) {
  const { Text } = Typography;

  const handRowAudio = (elem: IItems, index: number) => {
    const checkId = `${elem?.file?.key}-${index}`;
    if (activeAudio === null || activeAudio.idAudio !== checkId)
      setActiveAudio({
        idAudio: checkId,
        index: index,
        ...elem,
      });
  };
  return (
    <Flex vertical className="row-audio">
      {items.map((elem, index) => (
        <Flex
          onClick={() => handRowAudio(elem, index)}
          key={index}
          className={clsx(
            "block-row",
            `${elem?.file?.key}-${index}` === activeAudio?.idAudio &&
              "active-audio",
          )}
          data-active={
            `${elem?.file?.key}-${index}` === activeAudio?.idAudio
              ? "active"
              : "not-active"
          }
        >
          <Flex className="block-image-audio">
            <img
              loading="lazy"
              className="image-audio"
              src={getImageSrc(
                environment.assetsUrl,
                elem.cover.key,
                optionsImg,
              )}
            />
            <CirclePulsing
              isActive={
                `${elem?.file?.key}-${index}` === activeAudio?.idAudio
                  ? true
                  : false
              }
              isPlay={isPlaying}
            />
          </Flex>
          <Flex className="block-title">
            <Text className="title size-lg">{elem.title}</Text>
          </Flex>
          <Flex className="block-time">
            <Text disabled type="spTertiary" className="size-lg">
              {elem.duration}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}
