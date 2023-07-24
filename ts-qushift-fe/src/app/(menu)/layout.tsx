"use client";

import { Header } from "@/components/Header";
import { SideMenuLayout } from "@/components/SideMenuLayout";
import { Footer } from "@/components/Footer";
import { Box, Grid } from "@chakra-ui/react";
import { FiLayout, FiMessageSquare } from "react-icons/fi";
import { SWRConfig, SWRConfiguration } from "swr";
import { NextAuthProvider } from "@/app/providers";
import { Chakra } from "@/styles/Chakra";
import { usePathname } from "next/navigation";
import React from "react";

const menuButtonOptions = [
  {
    label: "Dashboard",
    pathname: "/dashboard",
    desc: "Dashboard Dashboard",
    icon: FiLayout,
  },
  {
    label: "Messages",
    pathname: "/messages",
    desc: "Messages",
    icon: FiMessageSquare,
  },
];

const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnMount: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <html lang="en">
      <body>
        <div className="grid grid-rows-[min-content_1fr_min-content] h-full justify-items-stretch">
          <Chakra>
            <SWRConfig value={swrConfig}>
              <NextAuthProvider>
                <Grid templateRows="min-content 1fr" h="full">
                  <Header />

                  <SideMenuLayout menuButtonOptions={menuButtonOptions}>
                    <Grid templateRows="1fr min-content" h="full">
                      <Box>{children}</Box>
                      <Box mt="10">
                        <Footer />
                      </Box>
                    </Grid>
                  </SideMenuLayout>
                </Grid>

                <Footer />
              </NextAuthProvider>
            </SWRConfig>
          </Chakra>
        </div>
      </body>
    </html>
  );
}
