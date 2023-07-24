import { Stack } from "@chakra-ui/react";
import React from "react";

import { MessageTableEntry } from "@/components/Messages/MessageTableEntry";
import { Message } from "@/types/Conversation";

interface MessageTableProps {
  messages: Message[];
}

export function MessageTable({ messages }: MessageTableProps) {
  return (
    <Stack spacing="4">
      {messages.map((item, index) => (
        <MessageTableEntry key={`${item.id}-${index}`} item={item} />
      ))}
    </Stack>
  );
}
