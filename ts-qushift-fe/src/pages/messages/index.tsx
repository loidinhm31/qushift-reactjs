import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { getDashboardLayout } from "src/components/Layout";
import { Topic } from "../../components/Messages/Topic";
import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Messages = ({ apiBaseUrl }: { apiBaseUrl: string }) => {
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
					<Topic apiBaseUrl={apiBaseUrl} sendSignal={false}/>
				</Box>
				<Box w="800px">

				</Box>
			</HStack>
		</>
	);
};

Messages.getLayout = getDashboardLayout;

export const getServerSideProps = async ({ locale }) => ({
	props: {
		apiBaseUrl: process.env.API_BASE_URL,
		...(await serverSideTranslations(locale, ["index", "common"]))
	}
});

export default Messages;
