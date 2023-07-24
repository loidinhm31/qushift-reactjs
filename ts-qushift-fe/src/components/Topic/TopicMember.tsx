import { Box, Button, List, ListItem, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Topic } from "@/types/Conversation";
import { useSession } from "next-auth/react";
import { CreatableMembersElement } from "@/components/Topic/CreatableMembersElement";
import { redirect } from "next/navigation";

interface TopicMemberProps {
  currTopic: Topic;
}

export function TopicMember({ currTopic }: TopicMemberProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !session.user) {
      redirect("/signin");
      return;
    }
  }, [session])

  return (
    <Box overflowY="auto" maxHeight="700px" className="overflow-y-auto p-3 w-full">
      <Box p="3" fontSize="lg" as="b">
        Members
      </Box>
      <List className="grid grid-cols-3 col-span-3 sm:flex sm:flex-col gap-2">
        {currTopic.members &&
          currTopic.members.map((item) => (
            <ListItem key={`${item.userId}`} style={{ textDecoration: "none" }}>
              <Button justifyContent={["center", "center", "center", "left"]} gap="5" size="lg" width="full">
                <Text fontWeight="normal" className="hidden lg:block">
                  {item.username}
                </Text>
              </Button>
            </ListItem>
          ))}

        <CreatableMembersElement />
      </List>
    </Box>
  );
}
