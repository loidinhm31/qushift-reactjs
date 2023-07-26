import { Box, Button, Grid, Input } from "@chakra-ui/react";
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
      <Box className="{classes.container}">
        <Box className="{classes.paper}">
          <form className="{classes.root}" noValidate autoComplete="off">
            <Grid className="{classes.gridContainer}">
              <Grid className="{classes.padding}">
                <Box>Account Info</Box>
                <Input
                  onChange={(e) => {
                    callProps.setName!(e.target.value);
                  }}
                  value={callProps.name}
                />
                <CopyToClipboard text={callProps.me} className="{classes.margin}">
                  <Button variant="contained" color="primary">
                    Copy Your ID
                  </Button>
                </CopyToClipboard>

                <Button onClick={switchCameraStatus}>
                  {(callProps.cameraStatus && "Turn Off Camera") || "Turn On Camera"}
                </Button>
                <Button onClick={switchAudioStatus}>
                  {(callProps.audioStatus && "Turn Off Audio") || "Turn On Audio"}
                </Button>
              </Grid>

              <Grid className="{classes.padding}">
                <Box>Make a call</Box>
                <Input onChange={(e) => setIdToCall(e.target.value)} value={idToCall} />

                {callProps.callAccepted && !callProps.callEnded ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={callProps.leaveCall}
                    className="{classes.margin}"
                  >
                    Hang Up
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => callProps.callUser!(idToCall)}
                    className="{classes.margin}"
                  >
                    <BiPhone />
                    Call
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>

          <Notifications
            answerCall={callProps.answerCall}
            call={callProps.call}
            callAccepted={callProps.callAccepted}
          />
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
