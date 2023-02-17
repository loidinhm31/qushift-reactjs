// https://nextjs.org/docs/basic-features/layouts

import { Box, Grid } from "@chakra-ui/react";
import type { NextPage } from "next";
import { FiLayout, FiMessageSquare } from "react-icons/fi";
import { Header } from "src/components/Header";

import { SideMenuLayout } from "./SideMenuLayout";
import { Footer } from "./Footer";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export const getDefaultLayout = (page: React.ReactElement) => (
    <div className="grid grid-rows-[min-content_1fr_min-content] h-full justify-items-stretch">
        <Header />
            {page}
        <Footer />
    </div>
);

export const getTransparentHeaderLayout = (page: React.ReactElement) => (
    <div className="grid grid-rows-[min-content_1fr_min-content] h-full justify-items-stretch">
        <Header />
        {page}
        <Footer />
    </div>
);

export const getDashboardLayout = (page: React.ReactElement) => (
    <Grid templateRows="min-content 1fr" h="full">
        <Header />
        <SideMenuLayout
            menuButtonOptions={[
                {
                    label: "Dashboard",
                    pathname: "/dashboard",
                    desc: "Dashboard Dashboard",
                    icon: FiLayout
                },
                {
                    label: "Messages",
                    pathname: "/messages",
                    desc: "Messages",
                    icon: FiMessageSquare
                }
            ]}
        >
            <Grid templateRows="1fr min-content" h="full">
                <Box>{page}</Box>
                <Box mt="10">
                    <Footer />
                </Box>
            </Grid>
        </SideMenuLayout>
    </Grid>
);

export const noLayout = (page: React.ReactElement) => page;
