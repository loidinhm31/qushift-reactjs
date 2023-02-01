import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { getDashboardLayout } from "src/components/Layout";
import { TopicMenu } from "../../components/Topic/TopicMenu";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSession } from "next-auth/react";

const Messages = () => {
    const { data: session } = useSession();

	const boxBgColor = useColorModeValue("white", "gray.800");
	const boxAccentColor = useColorModeValue("gray.200", "gray.900");

	if (!session) {
		return;
	}

	return (
		<>
			<Head>
				<title>Messages</title>
				<meta name="description" content="QuShift." />
			</Head>

			<HStack spacing="20px">
				<Box w="500px"
					 backgroundColor={boxBgColor}
					 boxShadow="base"
					 dropShadow={boxAccentColor}
					 borderRadius="xl"
					 className="p-4 shadow">
					<TopicMenu sendSignal={false} />
				</Box>

			</HStack>
		</>
	);
};

Messages.getLayout = getDashboardLayout;

export const getServerSideProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale, ["index", "common"]))
	}
});

export default Messages;
