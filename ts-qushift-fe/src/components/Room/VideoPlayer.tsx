import React, { useEffect, useRef, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { CallProps } from "../../types/Video";
import SimplePeer from "simple-peer";
import camelCase from "next/dist/build/webpack/loaders/css-loader/src/camelcase";

interface PeerProp {
	peer?: SimplePeer.Instance;
}

const VideoElement = ({ peer }: PeerProp) => {
	const userRef = useRef<HTMLVideoElement>();
	const [userStream, setUserStream] = useState<MediaStream>();

	useEffect(() => {
		peer.on("stream", stream => {
			setUserStream(stream);
		});
	}, []);

	useEffect(() => {
        console.log(userStream);
		if (userStream) {
			userRef.current.srcObject = userStream;
		} else {
			if (userRef.current) {
				userRef.current.srcObject = undefined;
			}
		}
	}, [userStream]);

	return (
		<video ref={userRef} autoPlay playsInline className="{classes.video}" />
	);
};

const VideoPlayer = ({ peers, name, callAccepted, callEnded, stream, cameraStatus }: CallProps) => {
	const myVideo = useRef<HTMLVideoElement>();

	useEffect(() => {
		if (cameraStatus) {
			if (stream) {
				myVideo.current.srcObject = stream;
			}
		} else {
			if (myVideo.current) {
				myVideo.current.srcObject = undefined;
			}
		}

	}, [cameraStatus, stream]);

	return (
		<Grid>
			{stream && (
				<Box className="{classes.paper}">
					<Grid>
						<Box>{name || "Name"}</Box>
						<video muted ref={myVideo} autoPlay playsInline className="{classes.video}" />
					</Grid>
				</Box>
			)}

			{!callEnded &&
                peers.map((p, index) => {
					return (
						<VideoElement key={index} peer={p} />
					);
				})
			}
		</Grid>
	);
};

export default VideoPlayer;
