import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { RiUserAddLine } from "react-icons/ri";
import useSWRMutation from "swr/mutation";

import { post } from "@/lib/api";
import { colors } from "@/styles/Theme/colors";

export const CreatableMembersElement = () => {
  const firstFieldRef = useRef<HTMLUListElement | null>(null);
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} justifyContent={["center", "center", "center", "left"]} gap="3" width="full">
        <RiUserAddLine size="25" className="text-black-400" />
        <Box>Add</Box>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={firstFieldRef}>
        <ModalOverlay />

        <ModalContent>
          <Box className="relative h-4">
            <ModalCloseButton />
          </Box>

          <ModalBody width="auto" p="3" m="4" maxWidth="calc(100vw - 2rem)">
            <SubmitForm firstFieldRef={firstFieldRef} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface FormProps {
  firstFieldRef?: React.RefObject<HTMLUListElement>;
  onClose: () => void;
}

interface TopicProps {
  topicName: string;
  topicMembers: string[];
}

// TODO(#2)
const fakeMembers = [
  {
    userId: "fake",
    username: "fake",
  },
  {
    userId: "postman",
    username: "postman",
  },
];

const SubmitForm: React.FC<FormProps> = ({ firstFieldRef, onClose }) => {
  const [submittable, setSubmittable] = useState(false);

  const [addUsers, setAddUsers] = useState<string[]>([]);

  const [topicForm, setTopicForm] = useState<TopicProps>({
    topicName: "",
    topicMembers: [],
  });

  const { trigger } = useSWRMutation("/api/topics/add_member", post, {});

  const handleCheckboxState = (checked, userId) => {
    if (checked) {
      setAddUsers([...addUsers, userId]);
      handleChange();
    } else {
      /* empty */
    }
  };

  const handleChange = () => {
    if (addUsers.length > 0) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }

    // setTopicForm((prop) => ({
    // 	...prop,
    // 	topicName: event.target.value
    // }));
  };

  const submitTopic = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    console.log(addUsers);

    trigger(topicForm);

    setTopicForm({ topicName: "", topicMembers: [] });

    // Close Popover
    onClose();
  };

  return (
    <Stack pl={6} mt={1} spacing={1}>
      <List ref={firstFieldRef}>
        {fakeMembers.map((item) => (
          <ListItem key={item.userId}>
            <Checkbox
              id={item.userId}
              onChange={(e) => {
                handleCheckboxState(e.target.checked, item.userId);
              }}
            >
              {item.username}
            </Checkbox>
          </ListItem>
        ))}
      </List>

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
            Add
          </Button>
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};
