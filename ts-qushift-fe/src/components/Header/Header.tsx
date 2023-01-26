import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";


import { UserMenu } from "./UserMenu";
import React from "react";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { session } from "next-auth/core/routes";

function AccountButton() {
	const { data: session } = useSession();
	if (session) {
		return;
	}
	return (
		<Link href="/auth/signin" aria-label="Home">
			<Flex alignItems="center">
				<Button variant="outline" leftIcon={<FaUser />}>
					Sign in
				</Button>
			</Flex>
		</Link>
	);
}

export function Header() {
	const { t } = useTranslation();
	const { data: session } = useSession();
	const homeURL = session ? "/dashboard" : "/";

	return (
		<nav className="basic-theme">
			<Box display="flex" justifyContent="space-between" p="4">
				<Link href={homeURL} aria-label="Dashboard">
					<Flex alignItems="center">
						<Image src="/images/logos/logo.svg" className="mx-auto object-fill" width="50" height="50" alt="logo" />

						<Text fontFamily="inter" fontSize="2xl" fontWeight="bold" ml="3">
							{t("title")}
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
