"use client";

import { Container, Grid } from "@chakra-ui/react";
import React from "react";

import { NextAuthProvider } from "@/app/providers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Chakra } from "@/styles/Chakra";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <>
          <Chakra>
            <NextAuthProvider>
              <Header />
              <Grid m="10" p="10">
                <Container>
                  <div className="grid grid-rows-[min-content_1fr_min-content] h-full justify-items-stretch">
                    <div className="flex items-center justify-center sm:py-4 subpixel-antialiased">
                      <div className="flex items-center w-full max-w-2xl flex-col px-4 sm:px-6">
                        <div className="flex-auto items-center justify-center w-full py-10 px-4 sm:mx-0 sm:flex-none sm:rounded-2xl sm:p-4">
                          {children}
                        </div>
                      </div>
                    </div>
                  </div>
                </Container>
              </Grid>
              <Footer />
            </NextAuthProvider>
          </Chakra>
        </>
      </body>
    </html>
  );
}
