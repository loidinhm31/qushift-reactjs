import React, { useEffect, useRef, useState } from "react";

import { useUser } from "@/hooks/useUser";
import { fetchMessagesApi, useStreamMessageApi } from "@/service/messages";
import { Message } from "@/types/Conversation";

import { MessageLoading } from "./MessageLoading";
import { MessageTable } from "./MessageTable";

interface MessageProps {
  topicId: string;
  onMouseAction: (v: boolean) => void;
}

export function MessageBox(messageProps: MessageProps) {
  const { status, defaultUser: user } = useUser();

  const listInnerRef = useRef<HTMLDivElement | null>(null);
  const boxEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [currPage, setCurrPage] = useState<number>(0); // storing current page number
  const [prevPage, setPrevPage] = useState<number>(-1); // storing prev page number
  const [wasLastList, setWasLastList] = useState<boolean>(false); // setting a flag to know the last list
  const [isLoading, setIsLoading] = useState(true);

  // Control event source to work with SSE for the incoming message
  const incomingMessage = useStreamMessageApi(messageProps.topicId, user);

  useEffect(() => {
    if (status !== "loading") {
      fetchMessagesApi(currPage, messageProps.topicId, user)
        .then((res) => res.data)
        .then((data: Message[]) => {
          if (data) {
            if (currPage === 0) {
              // Get history messages
              console.log(`Getting history for id ${messageProps.topicId}...`);
              setMessages(data);
            } else if (
              !wasLastList && // Pagination when scroll to top
              prevPage !== currPage &&
              currPage !== 0
            ) {
              if (!data.length) {
                setWasLastList(true);
              } else {
                console.log(`Updating array for ${messageProps.topicId}, current page is ${currPage}...`);
                setMessages([...data, ...messages]);
              }
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [status, currPage]);

  const scrollToBottom = () => {
    boxEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onScrollToTop = () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      if (scrollTop === 0 && !wasLastList) {
        setCurrPage(currPage + 1);
      }
    }
  };

  // Listening the incoming message
  useEffect(() => {
    if (incomingMessage) {
      if (messages.length === 0 || !messages.some((m: Message) => m.id === incomingMessage.id)) {
        if (incomingMessage.topicId === messageProps.topicId) {
          console.log(`Updating stream for id ${messageProps.topicId}...`);
          setMessages([...messages, incomingMessage]);
        }
      }
    }
  }, [incomingMessage]);

  // Update page and set effect
  useEffect(() => {
    if (currPage === 0) {
      scrollToBottom();
    } else if (!wasLastList && prevPage !== currPage && currPage !== 0) {
      // already get history for the first page, not need to update it

      setPrevPage(currPage);
      listInnerRef.current?.scrollTo({ top: 700, left: 0, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {isLoading && <MessageLoading />}

      <div
        className="overflow-y-auto h-80"
        ref={listInnerRef}
        onScroll={onScrollToTop}
        onMouseEnter={() => messageProps.onMouseAction(true)}
        onMouseLeave={() => messageProps.onMouseAction(false)}
      >
        {messages ? <MessageTable messages={messages} /> : <div className="animate-spin">Loading...</div>}

        <div ref={boxEndRef} />
      </div>
    </>
  );
}
