import { Box, Divider } from "@chakra-ui/react";
import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <Box>
        <Divider />
        <Box display="flex" gap="4" flexDir="column" alignItems="center" my="8">
          <Box display="flex" alignItems="center">
            <Link href="/" aria-label="Dashboard" className="flex items-center gap-1">
              {/*<Image src="/images/logos/logo.svg" className="mx-auto object-fill" width="48" height="48" alt="logo" />*/}
            </Link>
          </Box>
        </Box>
      </Box>
    </footer>
  );
}
