"use client";

import { Box } from "@chakra-ui/react";
import React from "react";

import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <Box as="main" className="basis-auto">
      <Dashboard />
    </Box>
  );
}
