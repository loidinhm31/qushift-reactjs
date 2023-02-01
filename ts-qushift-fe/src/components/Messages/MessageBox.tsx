import { Box, CircularProgress, useColorModeValue } from "@chakra-ui/react";
import { MessageTable } from "./MessageTable";
import React, { useEffect, useRef, useState } from "react";
import { MessageLoading } from "./MessageLoading";
import useSWR from "swr";
import { Message } from "../../types/Conversation";
import { get } from "../../lib/api";

interface MessageProps {
	topicId: string;

	onMouseAction: (v: boolean) => void;
}

export const MessageBox = ({ topicId, onMouseAction }: MessageProps) => {
	const listInnerRef = useRef<HTMLDivElement | null>();
	const boxEndRef = useRef<HTMLDivElement | null>();

	const [currPage, setCurrPage] = useState(0); // storing current page number
	const [prevPage, setPrevPage] = useState(-1); // storing prev page number
	const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list

	const [messages, setMessages] = useState<Message[]>([]);
	const [incomingMessage, setIncomingMessage] = useState<Message>(undefined);

	// Get history messages
	const { isLoading } = useSWR<Message[]>(`../api/messages/${topicId}`, get, {
		onSuccess: (data) => {
			console.log(`Getting history for id ${topicId}...`);
			setMessages(data);
			scrollToBottom();
		},
	});

	const scrollToBottom = () => {
		boxEndRef.current?.scrollIntoView({behavior: "smooth"})
	};

	const onScrollToTop = () => {
		if (listInnerRef.current) {
			const { scrollTop } = listInnerRef.current;
			if (scrollTop === 0 && !wasLastList) {
				setCurrPage(currPage + 1);
			}
		}
	};

	// Clear messages when topic id change
	useEffect(() => {
		console.log("Changed id to " + topicId);

		// Reset page to 0
		setCurrPage(0);
		setPrevPage(-1);
		setWasLastList(false);

		setMessages([]);
		setIncomingMessage(undefined);
	}, [topicId]);



	// Control event source to work with SSE for the incoming message
	// useEffect(() => {
	// 	console.log(`Opening stream for id ${topicId}...`)
	// 	const url = `${apiBaseUrl}/messages/stream?topicId=${topicId}`;
	// 	const eventSource = new EventSource(url);
	//
	// 	eventSource.onopen = (event: any) => console.log("open", event);
	//
	// 	eventSource.onmessage = (event: any) => {
	// 		const tailMessage: Message = JSON.parse(event.data);
	// 		setIncomingMessage(tailMessage);
	// 	};
	//
	// 	eventSource.onerror = (event: any) => {
	// 		console.log("error", event);
	// 		if (event.readyState === EventSource.CLOSED) {
	// 			eventSource.close();
	// 		}
	// 	};
	//
	// 	return () => {
	// 		console.log(`Closing stream for id ${topicId}...`);
	// 		eventSource.close();
	// 	};
	// }, [topicId]);

	// Listening the incoming message
	useEffect(() => {
		if (incomingMessage) {
			if (!messages.some((m: Message) => m.id === incomingMessage.id)) {
				console.log(`Updating stream for id ${topicId}...`);
				setMessages([...messages, incomingMessage]);
				setIncomingMessage(undefined);
			}
		}
	}, [incomingMessage]);

	// Pagination when scroll to top
	// useEffect(() => {
	// 	if (!isLoading &&
	// 		!wasLastList &&
	// 		prevPage !== currPage &&
	// 		currPage !== 0) {	// already get history for the first page, not need to update it
	// 		console.log(`Updating array for ${topicId}, current page is ${currPage}...`);
	//
	// 		get(`${apiBaseUrl}/messages?topicId=${topicId}&start=${currPage}&size=20`)
	// 			.then((data) => {
	// 				const msgs = data as Message[];
	// 				if (!msgs.length) {
	// 					setWasLastList(true);
	// 				} else {
	// 					setPrevPage(currPage);
	// 					setMessages([...msgs, ...messages]);
	// 				}
	// 			})
	// 			.finally(() => {
	// 				listInnerRef.current?.scrollTo({ top: 700, left: 0, behavior: "smooth" });
	// 			})
	// 			.catch((err) => console.log(err));
	// 	}
	// }, [currPage]);

	return (
		<>
			{isLoading &&
                <MessageLoading />
			}

			<Box
				ref={listInnerRef}
				onScroll={onScrollToTop}
				overflowY="auto" height="700px"
				onMouseEnter={() => onMouseAction(true)}
				onMouseLeave={() => onMouseAction(false)}
				className="p-4 w-full shadow"
			>
				{!isLoading && messages ? <MessageTable messages={messages} /> : <CircularProgress isIndeterminate />}

				<Box ref={boxEndRef} />
			</Box>
		</>
	);
};