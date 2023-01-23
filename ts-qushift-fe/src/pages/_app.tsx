import "../styles/globals.css";

import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { getDefaultLayout, NextPageWithLayout } from "src/components/Layout";

import nextI18NextConfig from "../../next-i18next.config.js";
import { Chakra, getServerSideProps } from "../styles/Chakra";

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps: { cookies, ...pageProps } }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? getDefaultLayout;
	const page = getLayout(<Component {...pageProps} />);
	return (
		<Chakra cookies={cookies}>
			{page}
		</Chakra>
	);
}

export { getServerSideProps };
export default appWithTranslation(MyApp, nextI18NextConfig);
