import { Button, Icon, Link, List, ListItem } from "konsta/react";
import React, { useEffect, useState } from "react";
import { TbUserPlus } from "react-icons/tb";

import { useAppDispatch } from "@/hooks/redux";
import { useUser } from "@/hooks/useUser";
import { resetDialog, setDialog } from "@/redux/feature/dialogSlice";
import { addMembersApi } from "@/service/messages";
import { Member } from "@/types/Conversation";

interface CreatableMembersProps {
  topicId: string;
  mutateTopic: (flag: boolean) => void;
}

export const CreatableMembersElement = ({ topicId, mutateTopic }: CreatableMembersProps) => {
  const dispatch = useAppDispatch();

  const openDialog = () => {
    dispatch(
      setDialog({
        isOpen: true,
        title: "Add Member",
        dialogNode: <SubmitForm topicId={topicId} mutateTopic={mutateTopic} />,
      }),
    );
  };

  return (
    <>
      <Link
        navbar
        iconOnly
        className="flex items-center justify-center p-1 rounded-full bg-gray-500"
        onClick={() => openDialog()}
      >
        <Icon ios={<TbUserPlus className="w-7 h-7" />} material={<TbUserPlus className="w-6 h-6" />} />
      </Link>
    </>
  );
};

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

const SubmitForm: React.FC<CreatableMembersProps> = ({ topicId, mutateTopic }) => {
  const { defaultUser: user } = useUser();

  const dispatch = useAppDispatch();

  const [submittable, setSubmittable] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    handleChange();
  }, [members]);

  const handleCheckboxState = (checked: boolean, member: Member) => {
    if (checked) {
      setMembers([...members, member]);
    } else {
      setMembers(members.filter((m) => m.userId !== member.userId));
    }
  };

  const handleChange = () => {
    if (members.length > 0) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
  };

  const submitTopic = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    addMembersApi(members, topicId, user).then(() => {
      mutateTopic(true);
    });

    setMembers([]);

    // Close Popover
    dispatch(resetDialog());
  };

  return (
    <div className="pl-6 mt-1 space-y-1">
      <List>
        {fakeMembers.map((item) => (
          <ListItem key={item.userId}>
            <label htmlFor={item.userId} className="inline-flex items-center">
              <input
                type="checkbox"
                id={item.userId}
                onChange={(e) => {
                  handleCheckboxState(e.target.checked, item);
                }}
                className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
              />
              <span className="ml-2">{item.username}</span>
            </label>
          </ListItem>
        ))}
      </List>

      <div className="flex justify-center p-4">
        <div className="flex justify-end">
          <Button disabled={!submittable} onClick={submitTopic} className=" px-4 py-2 rounded-md font-semibold">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
