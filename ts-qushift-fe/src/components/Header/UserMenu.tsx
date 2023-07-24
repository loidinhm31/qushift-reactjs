import {
  Avatar,
  Box,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { ElementType, useCallback, useEffect } from "react";
import { FiLayout, FiLogOut, FiSettings } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { boolean } from "boolean";

interface MenuOption {
  name: string;
  href: string;
  desc: string;
  icon: ElementType;
  isExternal: boolean;
}

export function UserMenu() {
  const borderColor = useColorModeValue("gray.300", "gray.600");

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);
  const { data: session, status } = useSession();

  const options: MenuOption[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      desc: "dashboard",
      icon: FiLayout,
      isExternal: false,
    },
    {
      name: "Account Settings",
      href: "/account",
      desc: "account_settings",
      icon: FiSettings,
      isExternal: false,
    },
  ];

  return (
    <>
      {boolean(session && status === "authenticated") && (
        <Menu>
          <MenuButton border="solid" borderRadius="full" borderWidth="thin" borderColor={borderColor}>
            <Box display="flex" alignItems="center" gap="3" p="1" paddingRight={[1, 1, 1, 6, 6]}>
              <Avatar size="sm" bgImage={session?.user.image!}></Avatar>
              <Text data-cy="username" className="hidden lg:flex">
                {session?.user.name || "New User"}
              </Text>
            </Box>
          </MenuButton>
          <MenuList p="2" borderRadius="xl" shadow="none">
            <Box display="flex" flexDirection="column" alignItems="center" borderRadius="md" p="4">
              <Text>{session?.user.name}</Text>
            </Box>
            <MenuDivider />
            <MenuGroup>
              {options.map((item) => (
                <Link
                  key={item.name}
                  as={item.isExternal ? "a" : NextLink}
                  isExternal={item.isExternal}
                  href={item.href}
                  _hover={{ textDecoration: "none" }}
                >
                  <MenuItem gap="3" borderRadius="md" p="4">
                    <item.icon className="text-blue-500" aria-hidden="true" />
                    <Text>{item.name}</Text>
                  </MenuItem>
                </Link>
              ))}
            </MenuGroup>
            <MenuDivider />
            <MenuItem gap="3" borderRadius="md" p="4" onClick={handleSignOut}>
              <FiLogOut className="text-blue-500" aria-hidden="true" />
              <Text>{"Sign Out"}</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
