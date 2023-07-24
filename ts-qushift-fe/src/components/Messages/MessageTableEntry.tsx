import { Avatar, Box, HStack, Stack, useBreakpointValue, useColorModeValue, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { Message } from "@/types/Conversation";

interface MessageTableEntryProps {
  item: Message;
}

export function MessageTableEntry(props: MessageTableEntryProps) {
  const { item } = props;

  const { data: session } = useSession();

  const backgroundColor = useColorModeValue("gray.100", "gray.700");
  const backgroundColor2 = useColorModeValue("#DFE8F1", "#42536B");

  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  const inlineAvatar = useBreakpointValue({ base: true, sm: false });

  const avatar = useMemo(
    () => (
      <Avatar
        borderColor={borderColor}
        size={inlineAvatar ? "xs" : "sm"}
        mr={inlineAvatar ? 2 : 0}
        src={"/images/logos/logo.png"}
      />
    ),
    [borderColor, inlineAvatar],
  );

  const getDateTime = (dateTime) => {
    const now = new Date(dateTime);
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const dayToDisplay = date < 10 ? `0${date}` : `${date}`;
    const monthToDisplay = month < 10 ? `0${month}` : `${month}`;
    const hoursToDisplay = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesToDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${year}/${monthToDisplay}/${dayToDisplay} ${hoursToDisplay}:${minutesToDisplay}`;
  };

  return (
    <>
      {item.sender === session.user.id && (
        <Stack spacing="4" alignItems="flex-end">
          <HStack w={["full", "full", "full", "fit-content"]} gap={2}>
            <VStack>
              {!inlineAvatar && avatar}
              <Box fontSize="sm">{item.sender}</Box>
            </VStack>
            <VStack>
              <Box
                gap="2"
                width={["full", "full", "full", "fit-content"]}
                maxWidth={["full", "full", "full", "2xl"]}
                p="4"
                borderRadius="md"
                bg={backgroundColor}
                whiteSpace="pre-wrap"
              >
                {inlineAvatar && avatar}
                {item.content}
              </Box>
              <Box fontSize="xs">{getDateTime(item.createdAt)}</Box>
            </VStack>
          </HStack>
        </Stack>
      )}

      {item.sender !== session.user.id && (
        <Stack spacing="4">
          <HStack w={["full", "full", "full", "fit-content"]} gap={2}>
            <VStack>
              {!inlineAvatar && avatar}
              <Box fontSize="xs">{item.sender}</Box>
            </VStack>

            <VStack>
              <Box
                width={["full", "full", "full", "fit-content"]}
                maxWidth={["full", "full", "full", "2xl"]}
                p="4"
                borderRadius="md"
                bg={backgroundColor2}
                whiteSpace="pre-wrap"
              >
                {inlineAvatar && avatar}
                {item.content}
              </Box>
              <Box fontSize="sm">{getDateTime(item.createdAt)}</Box>
            </VStack>
          </HStack>
        </Stack>
      )}
    </>
  );
}
