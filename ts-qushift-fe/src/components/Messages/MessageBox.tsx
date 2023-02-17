import { Box, CircularProgress } from "@chakra-ui/react";
import { MessageTable } from "./MessageTable";
import React, { useEffect, useRef, useState } from "react";
import { MessageLoading } from "./MessageLoading";
import { Message } from "../../types/Conversation";
import { get } from "../../lib/api";
import { useEventStreamBreakState } from "../../hooks/eventstream/useEventStream";
import useSWR from "swr";

interface MessageProps {
	topicId: string;
	onMouseAction: (v: boolean) => void;
}

export function MessageBox(messageProps: MessageProps) {
	const listInnerRef = useRef<HTMLDivElement | null>();
	const boxEndRef = useRef<HTMLDivElement | null>();

	const [messages, setMessages] = useState<Message[]>([]);

	const [currPage, setCurrPage] = useState<number>(0); // storing current page number
	const [prevPage, setPrevPage] = useState<number>(-1); // storing prev page number
	const [wasLastList, setWasLastList] = useState<boolean>(false); // setting a flag to know the last list

	const { isLoading } = useSWR<Message[]>(`../api/messages/${messageProps.topicId}/?start=${currPage}`, get, {
		onSuccess: (data) => {
			if (currPage == 0) {	// Get history messages
				console.log(`Getting history for id ${messageProps.topicId}...`);
				setMessages(data);
			} else if (!wasLastList &&	// Pagination when scroll to top
				prevPage !== currPage &&
				currPage != 0) {
				if (!data.length) {
					setWasLastList(true);
				} else {
					console.log(`Updating array for ${messageProps.topicId}, current page is ${currPage}...`);
					setMessages([...data, ...messages]);
				}
			}
		},
	});

	// Control event source to work with SSE for the incoming message
	const incomingMessage = useEventStreamBreakState<Message>(
		`../api/stream/messages/?topicId=${messageProps.topicId}`
	);

	const scrollToBottom = () => {
		boxEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const onScrollToTop = () => {
		if (listInnerRef.current) {
			const { scrollTop } = listInnerRef.current;
			if (scrollTop === 0 && !wasLastList) {
				setCurrPage(currPage + 1);
			}
		}
	};

	// Listening the incoming message
	useEffect(() => {
		if (incomingMessage) {
			if (messages.length == 0 || !messages.some((m: Message) => m.id === incomingMessage.id)) {
				console.log(`Updating stream for id ${messageProps.topicId}...`);
				setMessages([...messages, incomingMessage]);
			}
		}
	}, [incomingMessage]);

	// Update page and set effect
	useEffect(() => {
		if (currPage == 0) {
			scrollToBottom();
		} else if (
			!wasLastList &&
			prevPage !== currPage &&
			currPage !== 0) {	// already get history for the first page, not need to update it

			setPrevPage(currPage);
			listInnerRef.current?.scrollTo({ top: 700, left: 0, behavior: "smooth" });
		}
	}, [messages]);

	return (
		<>
			{isLoading &&
                <MessageLoading />
			}

			<Box
				width={["100%", "100%", "100px", "xl"]}
				ref={listInnerRef}
				onScroll={onScrollToTop}
				overflowY="auto"
				maxHeight="700px"
				onMouseEnter={() => messageProps.onMouseAction(true)}
				onMouseLeave={() => messageProps.onMouseAction(false)}
				className="p-4 h-full"
			>
				{messages ? <MessageTable messages={messages} /> : <CircularProgress isIndeterminate />}

				<Box ref={boxEndRef} />
			</Box>
		</>
	);
};