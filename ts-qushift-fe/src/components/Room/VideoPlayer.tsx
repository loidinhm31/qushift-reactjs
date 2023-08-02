import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";

import { CallProps } from "@/types/Video";

interface PeerProp {
  peer?: SimplePeer.Instance;
}

const VideoElement = ({ peer }: PeerProp) => {
  const userRef = useRef<HTMLVideoElement | null>(null);
  const [userStream, setUserStream] = useState<MediaStream>();

  useEffect(() => {
    peer?.on("stream", (stream) => {
      setUserStream(stream);
    });
  }, [peer]);

  useEffect(() => {
    console.log(userStream);
    if (userStream) {
      userRef.current!.srcObject = userStream;
    } else {
      if (userRef.current) {
        userRef.current.srcObject = null;
      }
    }
  }, [userStream]);

  return <video ref={userRef} autoPlay playsInline className="{classes.video}" />;
};

const VideoPlayer = ({ peers, name, callAccepted, callEnded, stream, cameraStatus }: CallProps) => {
  const myVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (cameraStatus) {
      if (stream) {
        myVideo.current!.srcObject = stream;
      }
    } else {
      if (myVideo.current) {
        myVideo.current.srcObject = null;
      }
    }
  }, [cameraStatus, stream]);

  return (
    <div>
      {stream && (
        <div className="{classes.paper}">
          <div>
            <p>{name || "Name"}</p>
            <video muted ref={myVideo} autoPlay playsInline className="{classes.video}" />
          </div>
        </div>
      )}

      {!callEnded &&
        peers?.map((p, index) => {
          return <VideoElement key={index} peer={p} />;
        })}
    </div>
  );
};

export default VideoPlayer;
