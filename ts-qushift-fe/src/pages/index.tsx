import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Box } from "@chakra-ui/react";
import { getDashboardLayout } from "../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Dashboard from "./dashboard";

const Home = () => {
	const { t } = useTranslation("index");

	return (
		<>
			<Head>
				<title>{("title")}</title>
				<meta name="description" content={t("description")} />
			</Head>
			<Box as="main" className="basic-theme">
				<Dashboard />
			</Box>
		</>
	);
};

Home.getLayout = getDashboardLayout;

export const getStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale, ["index", "common"]))
	}
});

export default Home;
