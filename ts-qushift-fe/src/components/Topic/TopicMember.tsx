import { Chip, List, ListItem } from "konsta/react";
import React from "react";
import { TbUserCircle } from "react-icons/tb";

import { CreatableMembersElement } from "@/components/Topic/CreatableMembersElement";
import { Topic } from "@/types/Conversation";

interface TopicMemberProps {
  currTopic: Topic;
  mutateTopic: (flag: boolean) => void;
}

export function TopicMember({ currTopic, mutateTopic }: TopicMemberProps) {
  return (
    <div className="w-60">
      <div className="flex justify-center font-bold text-lg">Members</div>

      <div className="overflow-y-auto h-48">
        <List outline className="my-0 w-full">
          {currTopic.members &&
            currTopic.members.map((item) => (
              <ListItem
                key={`${item.userId}`}
                media={
                  <>
                    <div>
                      <Chip
                        media={
                          <>
                            <TbUserCircle className="w-6 h-6" />
                          </>
                        }
                      ></Chip>
                      <span className="p-2 font-normal">{item.username}</span>
                    </div>
                  </>
                }
              ></ListItem>
            ))}
        </List>
      </div>

      <div className="flex justify-center p-1">
        <CreatableMembersElement topicId={currTopic.id!} mutateTopic={mutateTopic} />
      </div>
    </div>
  );
}
