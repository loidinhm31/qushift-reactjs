import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { getDashboardLayout } from "src/components/Layout";
import { get } from "../../lib/api";
import useSWRImmutable from "swr/immutable";
import { Topic } from "../../components/Messages/Topic";
import React from "react";

export { getDefaultStaticProps as getStaticProps } from "src/lib/default_static_props";

const Messages = () => {
	const boxBgColor = useColorModeValue("white", "gray.800");
	const boxAccentColor = useColorModeValue("gray.200", "gray.900");

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
					<Topic sendSignal={false}/>
				</Box>
				<Box w="800px">

				</Box>
			</HStack>
		</>
	);
};

Messages.getLayout = getDashboardLayout;

export default Messages;
