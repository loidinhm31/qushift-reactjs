import { Input } from "@chakra-ui/input";
import { Box, HStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { Dispatch } from "react";
import { FiSend } from "react-icons/fi";
import useSWRMutation from "swr/mutation";

import { Action } from "@/hooks/message/useMessageReducer";
import { post } from "@/lib/api";

interface TopicProps {
  currTopicId: string;
  message: string;
  dispatch: Dispatch<Action>;
}

export function InputBox({ currTopicId, message, dispatch }: TopicProps) {
  const { data: session } = useSession();

  const { trigger } = useSWRMutation("/api/messages", post);

  const handleSubmit = () => {
    if (message.trim().length !== 0) {
      const data = {
        content: message,
        receiver: "test-b", // TODO
        sender: session?.user.id,
        topicId: currTopicId,
      };
      trigger(data).finally(() => {
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
    <HStack w={["full", "full", "full", "fit-content"]} gap={2} className="p-4">
      <Box _hover={{ cursor: "pointer", opacity: 0.9 }}>
        <span className="input-group-text py-3" onClick={handleSubmit}>
          <FiSend />
        </span>
      </Box>

      <Input
        width={["full", "full", "full", "xl"]}
        p="4"
        borderRadius="md"
        type="input"
        className="form-control"
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
    </HStack>
  );
}
