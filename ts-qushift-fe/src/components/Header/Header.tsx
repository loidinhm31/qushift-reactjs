import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import React from "react";
import { useSession } from "next-auth/react";
import { UserMenu } from "@/components/Header/UserMenu";
import AccountButton from "@/components/Header/Account";


export function Header() {
  const { data: session } = useSession();
  const homeURL = session ? "/dashboard" : "/";

  return (
    <nav className="basis-auto">
      <Box display="flex" justifyContent="space-between" p="4">
        <Link href={homeURL} aria-label="Dashboard">
          <Flex alignItems="center">
            <Image src="/images/logos/logo.svg" className="mx-auto object-fill" width="50" height="50" alt="logo" />

            <Text fontFamily="inter" fontSize="2xl" fontWeight="bold" ml="3">
              {"QuShift"}
            </Text>
          </Flex>
        </Link>

        <Flex alignItems="center" gap="4">
          <AccountButton />
          <UserMenu />
        </Flex>
      </Box>
    </nav>
  );
}
