import Peer from "simple-peer";
import SimplePeer from "simple-peer";

export interface CallProps {
  peers?: SimplePeer.Instance[];
  callAccepted?: boolean;
  callEnded?: boolean;
  stream?: MediaStream;
  cameraStatus?: boolean;
  setCameraStatus?: (flag: boolean) => void;
  audioStatus?: boolean;
  setAudioStatus?: (flag: boolean) => void;
  isReplaceStream?: boolean;
  setReplaceStream?: (flag: boolean) => void;
  name?: string;
  setName?: (name: string) => void;
  me?: string;
  call?: Caller;
  leaveCall?: () => void;
  callUser?: (id: string) => void;
  answerCall?: () => void;
}

export interface Caller {
  isReceivingCall?: boolean;
  id?: string;
  name?: string;
  signal?: any;
}
