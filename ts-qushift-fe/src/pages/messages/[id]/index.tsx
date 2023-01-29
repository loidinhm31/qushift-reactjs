import { Box, CircularProgress, Grid, HStack, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDashboardLayout } from "src/components/Layout";
import { Message } from "../../../types/Conversation";
import { TopicMenu } from "../../../components/Topic/TopicMenu";
import { MessageTable } from "src/components/Messages/MessageTable";
import { MessageLoading } from "../../../components/Messages/MessageLoading";
import React, { useEffect, useRef, useState } from "react";
import { InputBox } from "../../../components/Messages/InputBox";
import { get } from "../../../lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const MessageDetail = ({ id, apiBaseUrl }: { id: string, apiBaseUrl: string }) => {
	const dynamicRoute = useRouter().asPath;

	const { data: session } = useSession();

	const boxBgColor = useColorModeValue("white", "gray.800");
	const boxAccentColor = useColorModeValue("gray.200", "gray.900");

	const [isLoading, setIsLoading] = useState(true);
	const [messages, setMessages] = useState([]);
	const [incomingMessage, setIncomingMessage] = useState<Message>(undefined);
	const [sendSignal, setSendSignal] = useState(false);

	const boxEndRef = useRef<HTMLDivElement | null>();
	const listInnerRef = useRef<HTMLDivElement | null>();
	const [currPage, setCurrPage] = useState(0); // storing current page number
	const [prevPage, setPrevPage] = useState(-1); // storing prev page number
	const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list

	// Clear messages when topic id change
	useEffect(() => {
		console.log("Changed id to " + id);

		setIsLoading(true);

		// Reset page to 0
		setCurrPage(0);
		setPrevPage(-1);
		setWasLastList(false);

		setSendSignal(false);

		setMessages([]);
		setIncomingMessage(undefined);

	}, [dynamicRoute]);

	// Control event source to work with SSE for the incoming message
	useEffect(() => {
		console.log(`Opening stream for id ${id}...`)
		const url = `${apiBaseUrl}/messages/stream?topicId=${id}`;
		const eventSource = new EventSource(url);

		eventSource.onopen = (event: any) => console.log("open", event);

		eventSource.onmessage = (event: any) => {
			const tailMessage: Message = JSON.parse(event.data);
			setIncomingMessage(tailMessage);
		};

		eventSource.onerror = (event: any) => {
			console.log("error", event);
			if (event.readyState === EventSource.CLOSED) {
				eventSource.close();
			}
		};

		return () => {
			console.log(`Closing stream for id ${id}...`);
			eventSource.close();
		};
	}, [dynamicRoute]);

	// Get history messages
	useEffect(() => {
		if (isLoading) {
			console.log(`Getting history for id ${id}...`);
			get(`${apiBaseUrl}/messages?topicId=${id}&start=0&size=20`)
				.then((data) => {
					setMessages(data);
				})
				.finally(() => {
					scrollToBottom();
					setIsLoading(false);
				})
				.catch((err) => console.log(err));
		}
	}, [isLoading, dynamicRoute]);

	// Listening the incoming message
	useEffect(() => {
		if (incomingMessage) {
			if (!messages.some((m: Message) => m.id === incomingMessage.id)) {
				console.log(`Updating stream for id ${id}...`);
				setMessages([...messages, incomingMessage]);
				setIncomingMessage(undefined);
			}
		}
	}, [incomingMessage]);

	// Pagination when scroll to top
	useEffect(() => {
		if (!isLoading &&
			!wasLastList &&
			prevPage !== currPage &&
			currPage !== 0) {	// already get history for the first page, not need to update it
			console.log(`Updating array for ${id}, current page is ${currPage}...`);

			get(`${apiBaseUrl}/messages?topicId=${id}&start=${currPage}&size=20`)
				.then((data) => {
					if (!data.length) {
						setWasLastList(true);
					} else {
						setPrevPage(currPage);
						setMessages([...data, ...messages]);
					}
				})
				.finally(() => {
					listInnerRef.current?.scrollTo({ top: 700, left: 0, behavior: "smooth" });
				})
				.catch((err) => console.log(err));
		}
	}, [currPage]);

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

	if (!session) {
		return;
	}

	return (
		<>
			<Head>
				<title>
					TODO

				</title>
				<meta
					name="description"
					content="TODO"
				/>
			</Head>

			<HStack spacing="20px">
				<Box w="500px"
					 backgroundColor={boxBgColor}
					 boxShadow="base"
					 dropShadow={boxAccentColor}
					 borderRadius="xl"
					 className="p-4 shadow">
					<TopicMenu apiBaseUrl={apiBaseUrl} currTopicId={id} sendSignal={sendSignal} />
				</Box>
				<Box w="800px">
					{isLoading &&
                        <MessageLoading />
					}

					<Grid templateRows="min-content 1fr" h="full">
						<Box
							ref={listInnerRef}
							onScroll={onScrollToTop}
							overflowY="auto" height="700px"
							onMouseEnter={() => setSendSignal(true)}
							onMouseLeave={() => setSendSignal(false)}
							className="p-4 w-full shadow"
						>
							{messages ? <MessageTable messages={messages} /> : <CircularProgress isIndeterminate />}

							<Box ref={boxEndRef} />
						</Box>

						<InputBox currTopicId={id} />
					</Grid>
				</Box>
			</HStack>
		</>
	);
};

MessageDetail.getLayout = (page) => getDashboardLayout(page);

export const getServerSideProps = async ({ locale, query }) => ({
	props: {
		id: query.id,
		apiBaseUrl: process.env.API_BASE_URL,
		...(await serverSideTranslations(locale, ["index", "common"]))
	}
});

export default MessageDetail;
