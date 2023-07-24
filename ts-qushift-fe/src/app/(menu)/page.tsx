"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <Box as="main" className="basis-auto">
      <Dashboard />
    </Box>
  );
}
