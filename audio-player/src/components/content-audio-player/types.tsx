import { Dispatch, RefObject, SetStateAction } from "react";

export interface IFile {
  id: string;
  key?: string;
  storage?: string;
  filename_disk?: string;
  filename_download?: string;
  title?: string | null;
  type?: string | null;
  folder?: string | null;
  uploaded_by?: string | null;
  created_on?: string | null;
  modified_by?: string | null;
  modified_on?: string | null;
  charset?: string | null;
  filesize?: string | null;
  width: number | null;
  height: number | null;
  duration?: string | null;
  embed?: string | null;
  description?: string | null;
  location?: string | null;
  blurhash?: string | null;
  tags?: string | null;
  metadata?: IFileMetadata | string | null;
  uploaded_on?: string | null;
  focal_point_x?: string | null;
  focal_point_y?: string | null;
  tus_id?: string | null;
  tus_data?: string | null;
}

export interface IFileMetadata {
  ifd0?: {
    Make?: string;
    Model?: string;
  };
  exif?: {
    FNumber?: number;
    ExposureTime?: number;
    FocalLength?: number;
    ISOSpeedRatings?: number;
  };
}

export interface IActiveAudio {
  idAudio: string;
  index: number;
  cover: {
    collection?: string;
    key: string;
  };
  title: string;
  duration: string;
  file: {
    collection?: string;
    key: string;
  };
}

export interface IItems {
  cover: {
    collection?: string;
    key: string;
  };
  duration: string;
  title: string;
  file: {
    collection?: string;
    key: string;
  };
}

export interface IRowAudio {
  activeAudio: IActiveAudio | null;
  setActiveAudio: Dispatch<SetStateAction<IActiveAudio | null>>;
  items: IItems[];
  isPlaying: boolean;
}

export interface IAudioPlayer {
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  isPlaying: boolean;
  setActiveAudio: Dispatch<SetStateAction<IActiveAudio | null>>;
  activeAudio: IActiveAudio | null;
  cover: IFile;
  audioRef: RefObject<HTMLAudioElement | null>;
  title: string;
  description?: string;
  items: IItems[];
  setCurrentTime: Dispatch<SetStateAction<number>>;
  currentTime: number;
  setDuration: Dispatch<SetStateAction<number>>;
  duration: number;
}

export interface ISoundButton {
  activeAudio: IActiveAudio | null;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  isMuted: boolean;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
}

export interface IPauseButton {
  togglePlay: () => void;
  isPlaying: boolean;
  setActiveAudio: Dispatch<SetStateAction<IActiveAudio | null>>;
  activeAudio: IActiveAudio | null;
  items: IItems[];
}

export interface MediaSessionActionDetails {
  action?: MediaSessionAction;
  seekTime?: number;
  fastSeek?: boolean;
}
