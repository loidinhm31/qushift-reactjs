import { Box, Divider, Flex, Grid, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";

export { getDefaultStaticProps as getStaticProps } from "src/lib/default_static_props";

export default function Account() {
	const backgroundColor = useColorModeValue("white", "gray.700");

	const { data: session } = useSession();

	if (!session) {
		return;
	}
	return (
		<>
			<Head>
				<title>My Account - QuShift</title>
				<meta
					name="description"
					content="QuShift."
				/>
			</Head>
			<main className="oa-basic-theme p-6">
				<Flex m="auto" className="max-w-7xl" alignContent="center">
					<Box borderRadius="xl"
						 gap="2"
						 shadow="base"
						 bgColor={backgroundColor}
						 className="p-4 sm:p-6 w-full">
						<Text as="b" display="block" fontSize="2xl" py={2}>
							Your Account
						</Text>
						<Divider />
						<Grid gridTemplateColumns="repeat(2, max-content)" alignItems="center" gap={6} py={4}>
							<Text as="b">ID</Text>
							<Text>{session.user.id ?? "(No ID)"}</Text>
							<Text as="b">Username</Text>
							<Flex gap={2}>
								{session.user.name ?? "(No username)"}
								<Link href="/account/edit">
									<Icon boxSize={5} as={MdOutlineEdit} />
								</Link>
							</Flex>
							<Text as="b">Email</Text>
							<Text>{session.user.email ?? "(No Email)"}</Text>
						</Grid>
						<p></p>
					</Box>
				</Flex>
			</main>
		</>
	);
}
