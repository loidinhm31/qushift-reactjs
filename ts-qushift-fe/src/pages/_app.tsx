import "../styles/globals.css";

import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { getDefaultLayout, NextPageWithLayout } from "@/components/Layout";

import nextI18NextConfig from "../../next-i18next.config.js";
import { Chakra, getServerSideProps } from "@/styles/Chakra";
import { SessionProvider } from "next-auth/react";
import { SWRConfig, SWRConfiguration } from "swr";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnMount: true,
};

function MyApp({ Component, pageProps: { session, cookies, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getDefaultLayout;
  const page = getLayout(<Component {...pageProps} />);
  return (
    <Chakra cookies={cookies}>
      <SWRConfig value={swrConfig}>
        <SessionProvider session={session}>{page}</SessionProvider>
      </SWRConfig>
    </Chakra>
  );
}

export { getServerSideProps };
export default appWithTranslation(MyApp, nextI18NextConfig);
