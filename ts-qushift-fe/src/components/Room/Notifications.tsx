import React from "react";

import { CallProps } from "@/types/Video";

const Notifications = ({ answerCall, call, callAccepted }: CallProps) => {
  return (
    <>
      {call?.isReceivingCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>{call.name} is calling:</h1>
          <button color="primary" onClick={answerCall}>
            Answer
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;
