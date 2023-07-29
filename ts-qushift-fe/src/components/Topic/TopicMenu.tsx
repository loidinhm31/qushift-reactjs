import { Badge, Box, Button, CircularProgress, List, ListItem } from "@chakra-ui/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Dispatch, useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { useEventStream } from "@/hooks/eventstream/useEventStream";
import { Action } from "@/hooks/message/useMessageReducer";
import { get, post } from "@/lib/api";
import { Member, Topic } from "@/types/Conversation";

import { CreatableTopicElement } from "./CreatableTopicElement";

interface TopicProps {
  currTopicId?: string;
  sendSignal: boolean;
  dispatch?: Dispatch<Action>;
}

export function TopicMenu({ currTopicId, sendSignal: wasSentSignal, dispatch }: TopicProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();

  const [topics, setTopics] = useState<Topic[]>();

  const [msgMap, setMsgMap] = useState<Map<string, string>>(new Map());

  const { trigger: sendSignal } = useSWRMutation("/api/v1/messages/signals", post);

  // Control event source to work with SSE for incoming notify
  const incomingTopic = useEventStream<Topic>(`/api/v1/stream/topics`);

  // Get all topics
  const { data, isLoading, isValidating, mutate } = useSWR(`/api/v1/topics?start=0`, get, {
    onSuccess: (data) => {
      setTopics(data);
    },
  });

  useEffect(() => {
    if (session && !session.user) {
      redirect("/signin");
    }
  }, [session]);

  // Reload invalidate data
  useEffect(() => {
    if (!isValidating) {
      setTopics(data);
    }
  }, [pathname]);

  const goToTopic = useCallback(
    (topicId: string) => {
      if (dispatch) {
        dispatch({
          type: "changed_selection",
          topicId: topicId,
        });
      }

      router.push(`/messages/${topicId}`);
    },
    [dispatch, router],
  );

  // Listening the incoming notify
  useEffect(() => {
    if (incomingTopic) {
      if (topics && incomingTopic.isNew) {
        if (!topics.some((t) => t.id === incomingTopic.originId)) {
          console.log(`Adding new topic ${incomingTopic.originId}`);
          setTopics([incomingTopic, ...topics]);
          // Force mutate data
          mutate(data);
        }
      } else if (!incomingTopic.isNew) {
        console.log(`Updating notification for receiver on topic ${incomingTopic.originId}...`);
        const user = incomingTopic.members?.find((member) => member.userId === session!.user.id) as Member;

        if (!user.checkSeen) {
          if (msgMap.has(incomingTopic.originId!)) {
            const countSeen = user.notSeenCount;
            if (countSeen! > 99) {
              msgMap.set(incomingTopic.originId!, "99+");
            } else {
              msgMap.set(incomingTopic.originId!, countSeen!.toString());
            }
          } else {
            msgMap.set(incomingTopic.originId!, user.notSeenCount!.toString());
          }
        } else {
          msgMap.set(incomingTopic.originId!, "0");
        }
        setMsgMap(new Map(msgMap));
      }
    }
  }, [incomingTopic, currTopicId]);

  // Send seen signal to server
  useEffect(() => {
    if (wasSentSignal) {
      if (msgMap.get(currTopicId!) !== "0" && msgMap.get(currTopicId!) !== undefined) {
        console.log(`Sending signal for ${currTopicId}...`);

        sendSignal({ currTopicId }).finally(() => {
          msgMap.set(currTopicId as string, "0");
        });
      }
    }
  }, [wasSentSignal]);

  return (
    <Box>
      <CreatableTopicElement>
        <Box overflowY="auto" maxHeight="700px" className="overflow-y-auto p-3 w-full">
          {isLoading && <CircularProgress isIndeterminate />}

          <List className="grid grid-cols-3 col-span-3 sm:flex sm:flex-col gap-2">
            {topics &&
              topics.map((item, index) => (
                <ListItem
                  onClick={() => goToTopic(item.id)}
                  key={`${item.id}-${index}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    justifyContent={["center", "center", "center", "left"]}
                    gap="3"
                    size="lg"
                    width="xs"
                    bg={currTopicId === item.id ? "blue.500" : undefined}
                    _hover={currTopicId === item.id ? { bg: "blue.600" } : undefined}
                  >
                    <Box
                      noOfLines={1}
                      fontWeight="normal"
                      color={currTopicId === item.id ? "white" : undefined}
                      className="hidden lg:block"
                    >
                      {item.name}
                      {msgMap.get(item.id) !== "0" && (
                        <Badge ml="1" fontSize="0.9em" colorScheme="red">
                          {msgMap.get(item.id)}
                        </Badge>
                      )}
                    </Box>
                  </Button>
                </ListItem>
              ))}
          </List>
        </Box>
      </CreatableTopicElement>
    </Box>
  );
}
