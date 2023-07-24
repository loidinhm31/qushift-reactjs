"use client";

import { Box, HStack, Progress, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { TopicMenu } from "@/components/Topic/TopicMenu";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWRImmutable from "swr/immutable";
import { get } from "@/lib/api";
import { Topic } from "@/types/Conversation";
import { redirect, useRouter } from "next/navigation";

export default function Message() {
  const { data: session } = useSession();

  const router = useRouter();

  const boxBgColor = useColorModeValue("white", "gray.800");
  const boxAccentColor = useColorModeValue("gray.200", "gray.900");

  const { isLoading, data } = useSWRImmutable<Topic[]>(`../api/topics/page/?start=0`, get);

  useEffect(() => {
    if (session && !session.user) {
      redirect("/signin");
      return;
    }
  }, [session]);

  useEffect(() => {
    if (session && data) {
      for (let i = 0; i < data.length; i++) {
        const members = data[i].members;
        for (let j = 0; j < members!.length; j++) {
          if (members![j].userId == session.user.id && members![j].checkSeen) {
            router.replace(`/messages/${data[i].id}`);
            return;
          }
        }
      }
    }
  }, [session, data]);

  return (
    <>
      <Head>
        <title>Messages</title>
        <meta name="description" content="QuShift." />
      </Head>

      <HStack className="gap-2 sm:flex sm:flex-col sm:justify-between p-4 h-full">
        <Box
          width={["100%", "100%", "100px", "fit-content"]}
          backgroundColor={boxBgColor}
          boxShadow="base"
          dropShadow={boxAccentColor}
          borderRadius="xl"
          className="p-4 h-full shadow"
        >
          {isLoading && <Progress size="xs" colorScheme="pink" isIndeterminate />}

          {!isLoading && data && <TopicMenu sendSignal={false} />}
        </Box>
      </HStack>
    </>
  );
};


