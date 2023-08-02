import { Block, Button } from "konsta/react";
import React, { Dispatch } from "react";
import { TbSend } from "react-icons/tb";

import { Action } from "@/hooks/message/useMessageReducer";
import { useUser } from "@/hooks/useUser";
import { makeMessageApi } from "@/service/messages";
import { Message } from "@/types/Conversation";

interface TopicProps {
  currTopicId: string;
  message: string;
  dispatch: Dispatch<Action>;
}

export function InputBox({ currTopicId, message, dispatch }: TopicProps) {
  const { defaultUser: user } = useUser();

  const handleSubmit = () => {
    if (message.trim().length !== 0) {
      const data: Message = {
        content: message,
        receiver: "test-b", // TODO
        sender: user!.id!,
        topicId: currTopicId,
      };

      makeMessageApi(data, user).finally(() => {
        // Finally, clear input
        dispatch({
          type: "sent_message",
        });
      });
    }
  };

  const handleEnterSubmit = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Block className="flex ">
      <textarea
        rows={4}
        className="block w-full text-sm dark:bg-gray-700 dark:border-gray-600 rounded-md dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        name="msg"
        value={message}
        onChange={(event) => {
          dispatch({
            type: "edited_message",
            message: event.target.value,
          });
        }}
        onKeyDown={(event) => handleEnterSubmit(event)}
      />
      <Block className="cursor-pointer opacity-90 hover:opacity-90">
        <Button className="input-group-text py-3" onClick={handleSubmit}>
          <TbSend />
        </Button>
      </Block>
    </Block>
  );
}
