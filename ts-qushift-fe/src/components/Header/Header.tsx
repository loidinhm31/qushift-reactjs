import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";


import { UserMenu } from "./UserMenu";
import React from "react";

export function Header() {
	const { t } = useTranslation();

	const homeURL = "/";

	return (
		<nav className="basic-theme">
			<Box display="flex" justifyContent="space-between" p="4">
				<Link href={homeURL} aria-label="Dashboard">
					<Flex alignItems="center">
						{/*<Image src="/images/logos/logo.svg" className="mx-auto object-fill" width="50" height="50"*/}
						{/*       alt="logo"/>*/}
						<Text fontFamily="inter" fontSize="2xl" fontWeight="bold" ml="3">
							{t("title")}
						</Text>
					</Flex>
				</Link>

				<UserMenu />
			</Box>
		</nav>
	);
}
