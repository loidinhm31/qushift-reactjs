import { boolean } from "boolean";
import { Block, Icon, Link, MenuList, MenuListItem, Preloader } from "konsta/react";
import { usePathname, useRouter } from "next/navigation";
import React, { Dispatch, useCallback, useEffect, useState } from "react";

import { Action } from "@/hooks/message/useMessageReducer";
import { useUser } from "@/hooks/useUser";
import { getTopicsApi, useStreamTopicApi } from "@/service/messages";
import { Member, Topic } from "@/types/Conversation";

import { CreatableTopicElement } from "./CreatableTopicElement";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";

interface TopicProps {
  currTopicId?: string;
  sendSignal: boolean;
  dispatch?: Dispatch<Action>;
}

export function TopicMenu({ currTopicId, sendSignal: wasSentSignal, dispatch }: TopicProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { status, defaultUser: user } = useUser();

  const [isHideTopic, setIsHideTopic] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isMutate, setIsMutate] = useState(false);
  const [topics, setTopics] = useState<Topic[]>();

  const [msgMap, setMsgMap] = useState<Map<string, string>>(new Map());

  // Control event source to work with SSE for incoming notify
  const incomingTopic = useStreamTopicApi(user);

  // Get all topics
  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(true);

      getTopicsApi(user)
        .then((res) => res.data)
        .then((data) => {
          if (data) {
            setTopics(data);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [pathname, status]);

  useEffect(() => {
    if (isMutate) {
      setIsLoading(true);

      getTopicsApi(user)
        .then((res) => res.data)
        .then((data) => {
          if (data) {
            setTopics(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsMutate(false);
        });
    }
  }, [isMutate]);

  const goToTopic = useCallback(
    (topicId: string) => {
      if (dispatch) {
        dispatch({
          type: "changed_selection",
          topicId: topicId
        });
      }

      router.push(`/messages/${topicId}`);
    },
    [dispatch, router]
  );

  // Listening the incoming notify
  useEffect(() => {
    if (incomingTopic) {
      if (topics && incomingTopic.isNew) {
        if (!topics.some((t) => t.id === incomingTopic.originId)) {
          console.log(`Adding new topic ${incomingTopic.originId}`);
          setTopics([incomingTopic, ...topics]);

          // Force mutate data
          setIsMutate(true);
        }
      } else if (!incomingTopic.isNew) {
        console.log(`Updating notification for receiver on topic ${incomingTopic.originId}...`);
        const userMember = incomingTopic.members?.find((member: Member) => member.userId === user?.id);

        if (userMember && !userMember.checkSeen) {
          if (msgMap.has(incomingTopic.originId!)) {
            const countSeen = userMember?.notSeenCount;
            if (countSeen! > 99) {
              msgMap.set(incomingTopic.originId!, "99+");
            } else {
              msgMap.set(incomingTopic.originId!, countSeen!.toString());
            }
          } else {
            msgMap.set(incomingTopic.originId!, userMember.notSeenCount!.toString());
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

        // sendSignal({ currTopicId }).finally(() => {
        //   msgMap.set(currTopicId as string, "0");
        // });
      }
    }
  }, [wasSentSignal]);

  return (
    <>
      {isHideTopic ? (
        <div className="my-4 py-4">
          <Link
            navbar
            iconOnly
            className="flex items-center justify-center p-1 rounded-full"
            onClick={() => setIsHideTopic(!isHideTopic)}
          >
            <Icon
              ios={<TbLayoutSidebarRightCollapse className="w-7 h-7" />}
              material={<TbLayoutSidebarRightCollapse className="w-6 h-6" />} />
          </Link>
        </div>

      ) : (
        <div className="w-80 lt-md:w-32">
          {isLoading && <Preloader />}

          <Block className="flex flex-row lt-md:flex-col items-center gt-md:space-between">
            <div className="flex items-center gt-md:w-full">
              <div>
                <p>Topics</p>
              </div>
              <div>
                <Link
                  navbar
                  iconOnly
                  className="flex items-center justify-center p-1 rounded-full"
                  onClick={() => setIsHideTopic(!isHideTopic)}
                >
                  <Icon
                    ios={<TbLayoutSidebarLeftCollapse className="w-7 h-7" />}
                    material={<TbLayoutSidebarLeftCollapse className="w-6 h-6" />} />
                </Link>
              </div>
            </div>
            <div>
              <CreatableTopicElement />
            </div>

          </Block>
          <MenuList className="overflow-y-auto h-96">
            {topics &&
              topics.map((item, index) => (
                <MenuListItem
                  key={`${item.id}-${index}`}
                  title={item.name}
                  active={currTopicId === item.id}
                  onClick={() => goToTopic(item.id!)}
                  media={
                    boolean(msgMap.get(item.id!) !== "0") && (
                      <Icon badge={msgMap.get(item.id!)} badgeColors={{ bg: "bg-red-500" }} />
                    )
                  }
                  className="whitespace-pre"
                />
              ))}
          </MenuList>
        </div>)
      }
    </>
  );
}
