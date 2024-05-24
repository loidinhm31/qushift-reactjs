import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { CallProps } from "../../types/Video";

const Notifications = ({ answerCall, call, callAccepted }: CallProps) => {

	return (
		<>
			{call.isReceivingCall && !callAccepted && (
				<div style={{ display: "flex", justifyContent: "space-around" }}>
					<h1>{call.name} is calling:</h1>
					<Button color="primary" onClick={answerCall}>
						Answer
					</Button>
				</div>
			)}
		</>
	);
};

export default Notifications;
