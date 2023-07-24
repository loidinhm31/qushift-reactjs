import { Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import { FaUser } from "react-icons/fa";

export default function AccountButton() {
  const { data: session } = useSession();

  return (
    <div>
      {!session && (
        <Link href="/signin" aria-label="Home">
          <Flex alignItems="center">
            <Button variant="outline" leftIcon={<FaUser />}>
              Sign in
            </Button>
          </Flex>
        </Link>
      )}
    </div>
  );
}
