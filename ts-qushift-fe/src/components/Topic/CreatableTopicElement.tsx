import { FocusLock } from "@chakra-ui/focus-lock";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { SlNote } from "react-icons/sl";
import useSWRMutation from "swr/mutation";

import { post } from "@/lib/api";
import { colors } from "@/styles/Theme/colors";
import { Member } from "@/types/Conversation";

interface CreatableTopicElementProps {
  children: React.ReactNode;
}

export const CreatableTopicElement = (props: CreatableTopicElementProps) => {
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} initialFocusRef={firstFieldRef} closeOnBlur={false}>
      <Box display="flex" alignItems="center" flexDirection={["column", "row"]} gap="2">
        <PopoverAnchor>{props.children}</PopoverAnchor>

        <Tooltip label="Create Topic" bg="red.500" aria-label="A tooltip">
          <Box>
            <PopoverTrigger>
              <Box as="button" display="flex" alignItems="center" justifyContent="center" borderRadius="full" p="1">
                <SlNote size="30" className="text-black-400" aria-hidden="true" />
              </Box>
            </PopoverTrigger>
          </Box>
        </Tooltip>
      </Box>

      <PopoverContent width="auto" p="3" m="4" maxWidth="calc(100vw - 2rem)">
        <PopoverArrow />
        <Box className="relative h-4">
          <PopoverCloseButton />
        </Box>
        <PopoverBody>
          <FocusLock persistentFocus={false}>
            <SubmitForm firstFieldRef={firstFieldRef} onClose={onClose} />
          </FocusLock>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

interface FormProps {
  firstFieldRef?: React.RefObject<HTMLInputElement>;
  onClose: () => void;
}

interface TopicProps {
  topicName: string;
  topicMembers: Member[];
}

const SubmitForm: React.FC<FormProps> = ({ firstFieldRef, onClose }) => {
  const { data: session } = useSession();
  const [submittable, setSubmittable] = useState(false);

  const [topicForm, setTopicForm] = useState<TopicProps>({
    topicName: "",
    topicMembers: [],
  });

  const { trigger: addTopic } = useSWRMutation("/api/v1/topics", post);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
    setTopicForm((prop) => ({
      ...prop,
      topicName: event.target.value,
    }));
  };

  const submitTopic = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    topicForm.topicMembers = [
      {
        userId: session!.user.id,
        username: session!.user.id,
      },
    ];

    // TODO(#2) api for add users in a topic

    addTopic(topicForm);

    setTopicForm({ topicName: "", topicMembers: [] });

    // Close Popover
    onClose();
  };

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel htmlFor="topic-name">Topic Name</FormLabel>
        <Input ref={firstFieldRef} id="topic-name" value={topicForm.topicName} onChange={handleChange} />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="topic-member">Topic Members</FormLabel>
        <Input id="topic-members" />
      </FormControl>

      <Flex justify="center" className="p-4">
        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button
            isDisabled={!submittable}
            onClick={submitTopic}
            className={`bg-indigo-600 text-${useColorModeValue(
              colors.light.text,
              colors.dark.text,
            )} hover:bg-indigo-700`}
          >
            Create
          </Button>
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};
