import { Box, Grid, HStack, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDashboardLayout } from "src/components/Layout";
import { TopicMenu } from "../../../components/Topic/TopicMenu";
import React, { useState } from "react";
import { InputBox } from "../../../components/Messages/InputBox";
import { getSession, useSession } from "next-auth/react";
import { MessageBox } from "../../../components/Messages/MessageBox";
import useSWR from "swr";
import { Topic } from "../../../types/Conversation";
import { get } from "../../../lib/api";
import { useRouter } from "next/router";

const MessageDetail = ({ id }: { id: string }) => {
	const { data: session } = useSession();

	const boxBgColor = useColorModeValue("white", "gray.800");
	const boxAccentColor = useColorModeValue("gray.200", "gray.900");

	const [sendSignal, setSendSignal] = useState(false);
	const router = useRouter();

	const [currTopic, setCurrTopic] = useState<Topic>(undefined);
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
					<TopicMenu currTopicId={id} sendSignal={sendSignal} />
				</Box>

				<Box w="800px">
					<Grid templateRows="min-content 1fr" h="full">
						<Box gap="2"
							 width={["full", "full", "full", "fit-content"]}
							 maxWidth={["full", "full", "full", "2xl"]}
							 p="4"
							 m="4"
							 borderRadius="md"
							 bg={boxAccentColor}>
							{currTopic && currTopic.name}
						</Box>

						<MessageBox topicId={id} onMouseAction={setSendSignal}></MessageBox>

						<InputBox currTopicId={id} />
					</Grid>
				</Box>
			</HStack>
		</>
	);
};

MessageDetail.getLayout = (page) => getDashboardLayout(page);

export const getServerSideProps = async ({ locale, query, ctx }) => ({
	props: {
		id: query.id,
		session: await getSession({ ctx }),
		...(await serverSideTranslations(locale, ["index", "common"]))
	}
});

export default MessageDetail;
