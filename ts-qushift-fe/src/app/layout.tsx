"use client";

import "./global.css";

import { App } from "konsta/react";
import React from "react";
import { TbDashboard, TbMessages } from "react-icons/tb";

import { Footer } from "@/components/Footer";
import { SideMenuLayout } from "@/components/SideMenuLayout";
import { ReduxProvider } from "@/redux/provider";

const menuButtonOptions = [
  {
    label: "Dashboard",
    pathname: "/dashboard",
    desc: "Dashboard Dashboard",
    icon: TbDashboard
  },
  {
    label: "Messages",
    pathname: "/messages",
    desc: "Messages",
    icon: TbMessages
  }
];


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
    <App theme="material">
      <ReduxProvider>
        <SideMenuLayout menuButtonOptions={menuButtonOptions}>{children}</SideMenuLayout>
        <Footer />
      </ReduxProvider>
    </App>
    </body>
    </html>
  );
}
