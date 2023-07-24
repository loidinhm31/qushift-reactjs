import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/styles/Theme";
import { CacheProvider } from "@chakra-ui/next-js";

export function Chakra({ children }) {

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
