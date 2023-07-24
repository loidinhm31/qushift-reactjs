"use client";

import { Box, Divider, Flex, Grid, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Account() {
  const backgroundColor = useColorModeValue("white", "gray.700");

  const { data: session } = useSession();

  useEffect(() => {
    if (session && !session.user) {
      redirect("/signin");
      return;
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>My Account - QuShift</title>
        <meta name="description" content="QuShift." />
      </Head>
      <Flex m="auto" className="max-w-7xl" alignContent="center">
        <Box
          m={10}
          p="10"
          borderRadius="xl"
          gap="2"
          shadow="base"
          bgColor={backgroundColor}
          className="p-4 sm:p-6 w-full"
        >
          <Text as="b" display="block" fontSize="2xl" py={2}>
            Your Account
          </Text>
          <Divider />
          <Grid gridTemplateColumns="repeat(2, max-content)" alignItems="center" gap={6} py={4}>
            <Text as="b">ID</Text>
            <Text>{session?.user.id ?? "(No ID)"}</Text>
            <Text as="b">Username</Text>
            <Flex gap={2}>
              {session?.user.name ?? "(No username)"}
              <Link href="/account/edit">
                <Icon boxSize={5} as={MdOutlineEdit} />
              </Link>
            </Flex>
            <Text as="b">Email</Text>
            <Text>{session?.user.email ?? "(No Email)"}</Text>
          </Grid>
          <p></p>
        </Box>
      </Flex>
    </>
  );
}
