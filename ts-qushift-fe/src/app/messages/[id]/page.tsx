"use client";

import { boolean } from "boolean";
import { redirect } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";

import { InputBox } from "@/components/Messages/InputBox";
import { MessageBox } from "@/components/Messages/MessageBox";
import { TopicMember } from "@/components/Topic/TopicMember";
import { TopicMenu } from "@/components/Topic/TopicMenu";
import { initialState, useMessageReducer } from "@/hooks/message/useMessageReducer";
import { useUser } from "@/hooks/useUser";
import { getTopicApi } from "@/service/messages";
import { Topic } from "@/types/Conversation";

export default function MessageDetail({ params }: { params: { id: string } }) {

  const { status, defaultUser: user } = useUser();

  const [isMutate, setIsMutate] = useState(false);

  const [wasSentSignal, setWasSentSignal] = useState<boolean>(false);

  const [currTopic, setCurrTopic] = useState<Topic>();

  const [msgState, dispatch] = useReducer(useMessageReducer, initialState);

  useEffect(() => {
    if (status !== "loading" && !user.id) {
      redirect("/signin");
    } else {
      getTopicApi(params.id, user)
        .then((res) => res.data)
        .then((data) => {
          if (data) {
            setCurrTopic(data);
          }
        });
    }
  }, [status, user]);

  useEffect(() => {
    if (isMutate) {
      getTopicApi(params.id, user)
        .then((res) => res.data)
        .then((data) => {
          if (data) {
            setCurrTopic(data);
          }
        });
    }
  }, [isMutate]);

  useEffect(() => {
    if (status != "loading" && user && !user.id) {
      redirect("/signin");
    }
  }, [status, user]);

  return (
    <div className="flex items-start">
      <div className="shadow-xl rounded-xl">
        <TopicMenu currTopicId={params.id} sendSignal={wasSentSignal} dispatch={dispatch} />
      </div>
      <div className="h-full w-full">
        <div className="text-2xl w-fit-content p-2 m-2 rounded-md">{currTopic?.name}</div>

        <div className="flex items-start">
          <div className="flex flex-col w-full">
            <MessageBox key={params.id} topicId={params.id} onMouseAction={setWasSentSignal} />

            <InputBox currTopicId={params.id} message={msgState.message} dispatch={dispatch} />
          </div>

          {boolean(typeof window !== "undefined" && window.innerWidth >= 787) && boolean(currTopic !== undefined) && (
            <div className="rounded-md">
              <TopicMember key={params.id} currTopic={currTopic!} mutateTopic={setIsMutate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
