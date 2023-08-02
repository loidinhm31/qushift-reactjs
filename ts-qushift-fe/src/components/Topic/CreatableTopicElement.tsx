import { Block, Button, Icon, Link } from "konsta/react";
import React, { useState } from "react";
import { TbPencilPlus } from "react-icons/tb";

import { useAppDispatch } from "@/hooks/redux";
import { useUser } from "@/hooks/useUser";
import { resetDialog, setDialog } from "@/redux/feature/dialogSlice";
import { createTopicApi } from "@/service/messages";
import { Member } from "@/types/Conversation";

export const CreatableTopicElement = () => {
  const dispatch = useAppDispatch();

  const openDialog = () => {
    dispatch(
      setDialog({
        isOpen: true,
        title: "Create Topic",
        dialogNode: <SubmitForm />,
      }),
    );
  };

  return (
    <>
      <Link
        navbar
        iconOnly
        className="flex items-center justify-center p-1 rounded-full"
        onClick={() => openDialog()}
      >
        <Icon ios={<TbPencilPlus className="w-7 h-7" />} material={<TbPencilPlus className="w-6 h-6" />} />
      </Link>
    </>
  );
};

interface TopicProps {
  topicName: string;
  topicMembers: Member[];
}

const SubmitForm: React.FC = () => {
  const { defaultUser: user } = useUser();
  const dispatch = useAppDispatch();

  const [submittable, setSubmittable] = useState(false);

  const [topicForm, setTopicForm] = useState<TopicProps>({
    topicName: "",
    topicMembers: [],
  });

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
        userId: user!.id!,
        username: user!.username!,
      },
    ];

    // TODO(#2) api for add users in a topic

    createTopicApi(
      {
        name: topicForm.topicName,
        members: topicForm.topicMembers,
        isNew: true,
      },
      user,
    );

    setTopicForm({ topicName: "", topicMembers: [] });

    // Close Popup
    dispatch(resetDialog());
  };

  return (
    <Block className="space-y-4">
      <Block className="mb-4">
        <label htmlFor="topic-name" className="block">
          Topic Name
        </label>
        <input
          id="topic-name"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black"
          value={topicForm.topicName}
          onChange={handleChange}
        />
      </Block>

      <Block className="mb-4">
        <label htmlFor="topic-members" className="block">
          Topic Members
        </label>
        <input
          id="topic-members"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black"
        />
      </Block>

      <div className="flex justify-center">
        <div className="flex justify-end">
          <Button disabled={!submittable} onClick={submitTopic}>
            Create
          </Button>
        </div>
      </div>
    </Block>
  );
};
