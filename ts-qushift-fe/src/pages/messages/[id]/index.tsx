import { Box, HStack, Stack, useColorModeValue, VStack } from "@chakra-ui/react";
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
import { TopicMember } from "../../../components/Topic/TopicMember";

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
		<Stack className="sticky sm:h-full">
			<Head>
				<title>
					QuShift - {currTopic && currTopic.name}
				</title>
				<meta
					name="description"
					content="TODO"
				/>
			</Head>

			<HStack className="gap-2 sm:flex sm:flex-col sm:justify-between p-4 h-full">
				<Box width={["100%", "100%", "100px", "fit-content"]}
					 backgroundColor={boxBgColor}
					 boxShadow="base"
					 dropShadow={boxAccentColor}
					 borderRadius="xl"
					 className="p-4 h-full shadow"
				>
					<TopicMenu currTopicId={id}
							   sendSignal={sendSignal}
							   dispatch={dispatch} />
				</Box>

				<Box className="p-4 h-full">
					<Box as="b"
						 fontSize="2xl"
						 gap="2"
						 width={["full", "full", "full", "fit-content"]}
						 maxWidth={["full", "full", "full", "2xl"]}
						 p="2"
						 m="2"
						 borderRadius="md"
						 bg={boxAccentColor}>
						{currTopic && currTopic.name}
					</Box>

					<HStack h="full">
						<VStack align="stretch" className="h-full">
							<MessageBox key={id}
										topicId={id}
										onMouseAction={setSendSignal} />

							<InputBox currTopicId={id} message={msgState.message} dispatch={dispatch} />
						</VStack>

						{currTopic &&
                            <Box gap="2"
                                 width={["full", "full", "full", "fit-content"]}
                                 maxWidth={["full", "full", "full", "2xl"]}
                                 p="1"
                                 m="1"
                                 borderRadius="md"
                                 bg={boxBgColor}
                                 className="h-full">

                                <TopicMember key={id} currTopic={currTopic} />
                            </Box>
						}

					</HStack>
				</Box>
			</HStack>
		</Stack>
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
