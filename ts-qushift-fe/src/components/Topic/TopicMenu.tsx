import { Badge, Box, Button, CircularProgress, List, ListItem, Text } from "@chakra-ui/react";
import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import { get, post } from "../../lib/api";
import { Member, Topic } from "../../types/Conversation";
import useSWRMutation from "swr/mutation";
import { useSession } from "next-auth/react";
import { CreatableTopicElement } from "./CreatableTopicElement";
import { useEventStream } from "../../hooks/eventstream/useEventStream";
import process from "process";

interface TopicProps {
	currTopicId?: string;
	sendSignal: boolean;
	dispatch?: Dispatch<any>;
}

export function TopicMenu({ currTopicId, sendSignal, dispatch }: TopicProps) {
	const router = useRouter();

	const { data: session } = useSession();

	const [msgMap, setMsgMap] = useState<Map<string, string>>(new Map());

	// Get all topics
	const { data: topics } = useSWRImmutable(`../api/topics/page`, get, { revalidateOnMount: true });

	const { trigger } = useSWRMutation("/api/messages/send_signal", post);

	const goToTopic = useCallback((topicId: string) => {
		if (dispatch) {
			dispatch({
				type: "changed_selection",
				topicId: topicId
			});
		}

		router.push(`/messages/${topicId}`);
	}, [router]);

	// Control event source to work with SSE for incoming notify
	const topic = useEventStream<Topic>(process.env.NEXT_PUBLIC_STREAM_URL, `topics/stream/${session.user.id}`);

	// Listening the incoming notify
	useEffect(() => {
		if (topic) {
			console.log(`Updating notification for receiver on topic ${topic.id}...`);

			const user = topic.members?.find(member => member.userId === session.user.id) as Member;

			if (!user.checkSeen) {
				if (msgMap.has(topic.id)) {
					const countSeen = user.notSeenCount;
					if (countSeen > 99) {
						msgMap.set(topic.id, "99+");
					} else {
						msgMap.set(topic.id, countSeen.toString());
					}
				} else {
					msgMap.set(topic.id, user.notSeenCount.toString());
				}
			} else {
				msgMap.set(topic.id, "0");
			}
			setMsgMap(new Map(msgMap));
		}
	}, [topic, currTopicId]);

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