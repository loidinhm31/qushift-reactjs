import React, { useState } from "react";
import { post } from "../../lib/api";
import { Input } from "@chakra-ui/input";
import { FiSend } from "react-icons/fi";
import { Box, HStack } from "@chakra-ui/react";
import useSWRMutation from "swr/mutation";

interface TopicProps {
    currTopicId: string;
}

export function InputBox({ currTopicId }: TopicProps) {
    const [msg, setMsg] = useState("");

    const { trigger } = useSWRMutation("/api/messages/send_message", post)

    const handleSubmit = () => {
        if (msg.trim().length !== 0) {
            const data = {
                content: msg,
                receiver: "test-b", // TODO
                sender: "test-a",  // TODO
                topicId: currTopicId
            }
            trigger(data).finally(() => setMsg(""));
        }
    };

    const handleEnterSubmit = (event: any) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <HStack w={["full", "full", "full", "fit-content"]} gap={2}
                className="p-4">
            <Box
                _hover={{ cursor: "pointer", opacity: 0.9 }}>
                    <span className="input-group-text py-3"
                          onClick={handleSubmit}>
                            <FiSend />
                    </span>
            </Box>

            <Input
                width={["full", "full", "full", "fit-content"]}
                maxWidth={["full", "full", "full", "2xl"]}
                p="4"
                borderRadius="md"
                type="input"
                className="form-control"
                name="msg"
                value={msg}
                onInput={(event: any) => setMsg(event.target.value)}
                onKeyDown={(event: any) => handleEnterSubmit(event)}
            />
        </HStack>
    );
}