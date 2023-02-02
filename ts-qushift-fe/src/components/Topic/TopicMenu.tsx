import { Badge, Box, Button, CircularProgress, List, ListItem, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import { get, post } from "../../lib/api";
import { Member, Topic } from "../../types/Conversation";
import useSWRMutation from "swr/mutation";
import { useSession } from "next-auth/react";
import { CreatableTopicElement } from "./CreatableTopicElement";

interface TopicProps {
	currTopicId?: string;
	sendSignal: boolean;
}

export function TopicMenu({currTopicId, sendSignal}: TopicProps) {
	const router = useRouter();

	const { data: session } = useSession();

	const [msgMap, setMsgMap] = useState<Map<string, string>>(new Map());
	const [updateTopic, setUpdateTopic] = useState<Topic>(undefined);

	// Get all topics
	const { data: topics } = useSWRImmutable(`../api/topics/page`, get, { revalidateOnMount: true });

	const { trigger } = useSWRMutation("/api/messages/send_signal", post)

	const goToTopic = useCallback((topicId: string) =>  {
		router.push(`/messages/${topicId}`);
	}, [router]);

	// Listening the incoming notify
	useEffect(() => {
		if (updateTopic) {
			console.log(`Updating notification for receiver on topic ${updateTopic.id}...`)

			const user = updateTopic.members?.find(member => member.user === session.user.id) as Member;

			if (!user.checkSeen) {
				if (msgMap.has(updateTopic.id)) {
					const countSeen = user.notSeenCount;
					if (countSeen > 99) {
						msgMap.set(updateTopic.id, "99+");
					} else {
						msgMap.set(updateTopic.id, countSeen.toString());
					}
				} else {
					msgMap.set(updateTopic.id, user.notSeenCount.toString());
				}
			} else {
				msgMap.set(updateTopic.id, "0");
			}
			setMsgMap(new Map(msgMap));
		}
	}, [updateTopic, currTopicId]);

	// Control event source to work with SSE for incoming notify
	useEffect(() => {
		// const url = `${apiBaseUrl}/topics/stream/${session.user.id}`;
		// const eventSource = new EventSource(url);
		//
		// console.log("Opening stream for topic...");
		// eventSource.onopen = (event: any) => console.log("open", event);
		//
		// eventSource.onmessage = (event: any) => {
		// 	const topic: Topic = JSON.parse(event.data);
		// 	setUpdateTopic(topic);
		// }
		//
		// eventSource.onerror = (event: any) => {
		// 	console.log("error", event);
		// 	if (event.readyState === EventSource.CLOSED) {
		// 		eventSource.close();
		// 	}
		// };
		//
		// return () => {
		// 	console.log(`Closing stream for receiver...`);
		// 	eventSource.close();
		// };
	}, [])

	// Send seen signal to server
	useEffect(() => {
		if (sendSignal) {
			if (msgMap.get(currTopicId) !== "0" &&
				msgMap.get(currTopicId) !== undefined) {

				console.log(`Sending signal for ${currTopicId}...`);

				trigger({ currTopicId })
					.finally(() => {
					msgMap.set(currTopicId as string, "0");
				});
			}
		}
	}, [sendSignal])

	if (!topics) {
		return <CircularProgress isIndeterminate />;
	}

	return (
		<Box>
			<CreatableTopicElement>
				<Box/>
			</CreatableTopicElement>
			<Box overflowY="auto" height="700px"
				className="overflow-y-auto p-3 w-full">
				<List className="grid grid-cols-3 col-span-3 sm:flex sm:flex-col gap-2">
                    {topics && (topics as Topic[]).map((item) => (
						<ListItem
							onClick={() => goToTopic(item.id)}
							key={`${item.id}`}
							style={{ textDecoration: "none" }}>

							<Button
								justifyContent={["center", "center", "center", "left"]}
								gap="3"
								size="lg"
								width="full"
								bg={currTopicId === item.id ? "blue.500" : null}
								_hover={currTopicId === item.id ? { bg: "blue.600" } : null}
							>
								<Text
									fontWeight="normal"
									color={currTopicId === item.id ? "white" : null}
									className="hidden lg:block"
								>
									{item.name}
									{msgMap.get(item.id) !== "0" &&
                                        <Badge ml="1" fontSize="0.9em" colorScheme="red">
											{msgMap.get(item.id)}
                                        </Badge>
									}
								</Text>
							</Button>
						</ListItem>
					))}
				</List>
			</Box>
		</Box>
	)
}