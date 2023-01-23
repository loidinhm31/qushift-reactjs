import { Box, Stack } from "@chakra-ui/react";
import { MessageTableEntry } from "src/components/Messages/MessageTableEntry";
import { Message } from "../../types/Conversation";
import React, { useRef } from "react";

interface MessageTableProps {
	messages: Message[];
}

export function MessageTable({ messages }: MessageTableProps) {

	return (
		<Stack spacing="4">
			{messages.map((item) => (
				<MessageTableEntry item={item} key={item.id} />
			))}
		</Stack>
	);
}
