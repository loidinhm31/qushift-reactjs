import { Box, CircularProgress, Grid, HStack, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDashboardLayout } from "src/components/Layout";
import useSWRImmutable from "swr/immutable";
import { Message } from "../../../types/Conversation";
import { Topic } from "../../../components/Messages/Topic";
import { get, retrieveMessages } from "../../../lib/api";
import { MessageTable } from "src/components/Messages/MessageTable";
import { MessageLoading } from "../../../components/Messages/MessageLoading";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InputBox } from "../../../components/Messages/InputBox";
import { environment } from "../../../environments/environment";

const MessageDetail = ({ id }: { id: string }) => {
	const boxBgColor = useColorModeValue("white", "gray.800");
	const boxAccentColor = useColorModeValue("gray.200", "gray.900");

	const [isLoading, setIsLoading] = useState(true);
	let [messages, setMessages] = useState<Message[]>([]);

	const boxEndRef = useRef<HTMLDivElement | null>(null);

	const listInnerRef = useRef<HTMLDivElement | null>(null);
	const [currPage, setCurrPage] = useState(0); // storing current page number
	const [prevPage, setPrevPage] = useState(0); // storing prev page number
	const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list

	const [sendSignal, setSendSignal] = useState(false);

	// Clear messages when topic id change
	useEffect(() => {
		console.log("Changed id to " + id);

		messages = [];

		// Reset page to 0
		setCurrPage(0);
		setPrevPage(0);
		setWasLastList(false);

	}, [id])

	// Get history messages
	useEffect(() => {
		console.log(`Getting history for id ${id}...${currPage}`);
		retrieveMessages(id, 0)
			.then((data) => {
				setMessages(data);
				setIsLoading(false);
			})
			.finally(() => scrollToBottom())
			.catch((err) => console.log(err));

	}, [id]);

	// Pagination when scroll to top
	useEffect(() => {
		console.log(`Updating list, current page is ${currPage}...`);
		if (!wasLastList && prevPage !== currPage) {
			setIsLoading(true);
			retrieveMessages(id, currPage)
				.then((data) => {
					if (!data.length) {
						setWasLastList(true)
					} else {
						setPrevPage(currPage);
						setMessages([...data, ...messages]);
					}
				})
				.catch((err) => console.log(err))
				.finally(() => {
					setIsLoading(false);
					listInnerRef.current?.scrollTo({top: 700, left: 0, behavior: 'smooth'})
				});
		}
	}, [currPage])

	// Callback for listening the incoming message
	const streamMessage = useCallback((tailMessage: Message) => {
		console.log(`Updating stream for id ${id}...`);

		messages.push(tailMessage);
		setMessages([...messages]);

	}, [messages, id]);

	// Control event source to work with SSE for the incoming message
	useEffect(() => {
		console.log(`Opening stream for id ${id}...`)

		const url = `${environment.API_BASE_URL}/messages/stream?topicId=${id}`;

		const eventSource = new EventSource(url);

		eventSource.onopen = (event: any) => console.log("open", event);

		eventSource.onmessage = (event: any) => {
			const tailMessage = JSON.parse(event.data);

			if (!messages.some((msg: Message) => msg.id === tailMessage.id)) {
				streamMessage(tailMessage);
			}
		}
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
	}, [id])

	const scrollToBottom = () => {
		boxEndRef.current?.scrollIntoView({behavior: "smooth"})
	}

	const onScrollToTop = () => {
		if (listInnerRef.current) {
			const {scrollTop} = listInnerRef.current;
			if (scrollTop === 0) {
				setCurrPage(currPage + 1);
			}
		}
	};

	return (
		<>
			<Head>
				<title>TODO</title>
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
					<Topic currTopicId={id} sendSignal={sendSignal} />
				</Box>
				<Box w="800px">
					{isLoading &&
                        <MessageLoading/>
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
		...(await serverSideTranslations(locale, ["index", "common"]))
	}
});

export default MessageDetail;
