import { Box, Grid, HStack, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDashboardLayout } from "src/components/Layout";
import { TopicMenu } from "../../../components/Topic/TopicMenu";
import React, { useReducer, useState } from "react";
import { InputBox } from "../../../components/Messages/InputBox";
import { useSession } from "next-auth/react";
import { MessageBox } from "../../../components/Messages/MessageBox";
import useSWR from "swr";
import { Topic } from "../../../types/Conversation";
import { get } from "../../../lib/api";
import { useRouter } from "next/router";
import { initialState, useMessageReducer } from "../../../hooks/message/useMessageReducer";

const MessageDetail = ({ id }: { id: string }) => {
	const router = useRouter();

	const { data: session } = useSession();

	const boxBgColor = useColorModeValue("white", "gray.800");
	const boxAccentColor = useColorModeValue("gray.200", "gray.900");

	const [sendSignal, setSendSignal] = useState<boolean>(false);

	const [currTopic, setCurrTopic] = useState<Topic>(undefined);

	const [msgState, dispatch] = useReducer(useMessageReducer, initialState);

	const { isLoading, mutate, error } = useSWR<Topic>(`../api/topics/${id}`, get, {
		onSuccess: (data) => {
			setCurrTopic(data);
		},
		onError: () => {
			router.push("/404");
		}
	});

	if (!session) {
		return;
	}

	return (
		<>
			<Head>
				<title>
					QuShift - {currTopic && currTopic.name}
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
					<TopicMenu currTopicId={id}
							   sendSignal={sendSignal}
							   dispatch={dispatch} />
				</Box>

				<Box w="800px">
					<Grid templateRows="min-content 1fr" h="full">
						<Box as="b"
							 fontSize="2xl"
							 gap="2"
							 width={["full", "full", "full", "fit-content"]}
							 maxWidth={["full", "full", "full", "2xl"]}
							 p="4"
							 m="4"
							 borderRadius="md"
							 bg={boxAccentColor}>
							{currTopic && currTopic.name}
						</Box>

						<MessageBox key={id} topicId={id} onMouseAction={setSendSignal} />

						<InputBox currTopicId={id} message={msgState.message} dispatch={dispatch} />
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
