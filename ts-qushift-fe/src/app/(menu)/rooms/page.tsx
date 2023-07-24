"use client";

import { useEffect, useRef, useState } from "react";
import { default as Peer, default as SimplePeer } from "simple-peer";
import { io, Socket } from "socket.io-client";
import Sidebar from "@/components/Room/Sidebar";
import VideoPlayer from "@/components/Room/VideoPlayer";
import { Caller } from "@/types/Video";

export default function Rooms() {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [cameraStatus, setCameraStatus] = useState(false);
  const [audioStatus, setAudioStatus] = useState(true);
  const [isReplaceStream, setReplaceStream] = useState(false);

  const [name, setName] = useState("");
  const [call, setCall] = useState<Caller>({});
  const [me, setMe] = useState("");

  const [peers, setPeers] = useState<SimplePeer.Instance[]>([]);
  const myPeer = useRef<SimplePeer.Instance>();

  const peersRef = useRef<SimplePeer.Instance[]>([]);

  const socketRef = useRef<Socket>();

  useEffect(() => {
    if (cameraStatus || audioStatus) {
      const mediaOptions = {
        video: cameraStatus,
        audio: audioStatus
      };

      navigator.mediaDevices.getUserMedia(mediaOptions).then((currStream) => {
        //
        if (isReplaceStream && myPeer.current) {
          myPeer.current.removeStream(stream!);
          myPeer.current.addStream(currStream);
        }

        //
        setStream(currStream);
        setReplaceStream(false);
      });
    }
  }, [cameraStatus, audioStatus]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5001");

    // TODO
    socketRef.current.on("me", (id) => setMe(id));

    socketRef.current.on("receiving_signal", (payload) => {
      setCall({
        isReceivingCall: true,
        id: payload.from.id,
        name: payload.from.name,
        signal: payload.signal
      });
    });

    // TODO
    socketRef.current.on("user_joined", (payload) => {
      const peer = addPeer(payload.signal, payload.caller.id, stream);
      peersRef.current.push(peer);
      setPeers([...peers, peer]);
    });
  }, []);

  function createPeer(userToSignal, caller, stream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream
    });

    const to = { id: userToSignal };
    peer.on("signal", (signal) => {
      socketRef.current?.emit("sending_signal", {
        to: to,
        from: caller,
        signal: signal
      });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on("signal", (signal) => {
      socketRef.current?.emit("returning_signal", {
        to: {
          id: call.id,
          name: call.name
        },
        signal: signal
      });
    });

    peer.signal(incomingSignal);
    return peer;
  }

  const answerCall = () => {
    setCallAccepted(true);

    const peer = addPeer(call.signal, call.id, stream);
    //
    myPeer.current = peer;
    //
    peersRef.current.push(peer);
    setPeers([...peers, peer]);
  };

  const callUser = (id) => {
    const caller = { id: me, name: name };
    const peer = createPeer(id, caller, stream);
    //
    myPeer.current = peer;
    //
    peersRef.current.push(peer);
    setPeers([...peers, peer]);

    socketRef.current?.on("accepted_signal", (payload) => {
      setCallAccepted(true);
      peer.signal(payload.signal);
    });
  };

  const leaveCall = () => {
    setCallEnded(true);

    // TODO destroy
    peersRef.current.forEach((value) => {
    });

    window.location.reload();
  };

  return (
    <>
      <VideoPlayer
        peers={peers}
        name={name}
        callAccepted={callAccepted}
        stream={stream}
        cameraStatus={cameraStatus}
        callEnded={callEnded}
      />
      <Sidebar
        stream={stream}
        cameraStatus={cameraStatus}
        setCameraStatus={setCameraStatus}
        audioStatus={audioStatus}
        setAudioStatus={setAudioStatus}
        isReplaceStream={isReplaceStream}
        setReplaceStream={setReplaceStream}
        me={me}
        call={call}
        callAccepted={callAccepted}
        name={name}
        setName={setName}
        callEnded={callEnded}
        callUser={callUser}
        answerCall={answerCall}
        leaveCall={leaveCall}
      />
    </>
  );
};