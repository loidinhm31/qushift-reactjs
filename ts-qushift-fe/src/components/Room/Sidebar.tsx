import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BiPhone } from "react-icons/bi";

import { CallProps } from "@/types/Video";

import Notifications from "./Notifications";

const Sidebar = (callProps: CallProps) => {
  const [idToCall, setIdToCall] = useState("");

  const switchCameraStatus = () => {
    callProps.setReplaceStream!(true);

    if (callProps.cameraStatus) {
      callProps.stream?.getVideoTracks()[0].stop();
      callProps.setCameraStatus!(false);
    } else {
      callProps.setCameraStatus!(true);
    }
  };

  const switchAudioStatus = () => {
    callProps.setReplaceStream!(true);

    if (callProps.audioStatus) {
      callProps.stream?.getAudioTracks()[0].stop();
      callProps.setAudioStatus!(false);
    } else {
      callProps.setAudioStatus!(true);
    }
  };

  return (
    <>
      <div className="{classes.container}">
        <div className="{classes.paper}">
          <form className="{classes.root}" noValidate autoComplete="off">
            <div className="{classes.gridContainer}">
              <div className="{classes.padding}">
                <div>Account Info</div>
                <input
                  onChange={(e) => {
                    callProps.setName!(e.target.value);
                  }}
                  value={callProps.name}
                />
                <CopyToClipboard text={callProps.me} className="{classes.margin}">
                  <button color="primary">Copy Your ID</button>
                </CopyToClipboard>

                <button onClick={switchCameraStatus}>
                  {(callProps.cameraStatus && "Turn Off Camera") || "Turn On Camera"}
                </button>
                <button onClick={switchAudioStatus}>
                  {(callProps.audioStatus && "Turn Off Audio") || "Turn On Audio"}
                </button>
              </div>

              <div className="{classes.padding}">
                <div>Make a call</div>
                <input onChange={(e) => setIdToCall(e.target.value)} value={idToCall} />

                {callProps.callAccepted && !callProps.callEnded ? (
                  <button color="secondary" onClick={callProps.leaveCall} className="{classes.margin}">
                    Hang Up
                  </button>
                ) : (
                  <button color="primary" onClick={() => callProps.callUser!(idToCall)} className="{classes.margin}">
                    <BiPhone />
                    Call
                  </button>
                )}
              </div>
            </div>
          </form>

          <Notifications
            answerCall={callProps.answerCall}
            call={callProps.call}
            callAccepted={callProps.callAccepted}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
