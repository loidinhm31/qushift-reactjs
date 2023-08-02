import { boolean } from "boolean";
import { Block, Button, Chip, Link, MenuList, MenuListItem, Navbar, Page, Popup } from "konsta/react";
import { useRouter } from "next/navigation";
import React, { ElementType, useCallback, useState } from "react";
import { FiLayout, FiLogOut, FiSettings } from "react-icons/fi";

import { useUser } from "@/hooks/useUser";
import { useAppSelector } from "@/hooks/redux";

interface MenuOption {
  name: string;
  href: string;
  desc: string;
  icon: ElementType;
  isExternal: boolean;
}

export function UserMenu() {
  const { defaultUser: user } = useUser();
  const auth = useAppSelector((state) => state.authReducer);

  const router = useRouter();

  const [popupOpened, setPopupOpened] = useState(false);

  const goToItem = (path: string) => {
    router.push(path);
    setPopupOpened(false);
  };

  const handleSignOut = useCallback(() => {
    // signOut({ callbackUrl: "/" });
  }, []);

  const options: MenuOption[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      desc: "dashboard",
      icon: FiLayout,
      isExternal: false
    },
    {
      name: "Account Settings",
      href: "/account",
      desc: "account_settings",
      icon: FiSettings,
      isExternal: false
    }
  ];

  return (
    <>
      {boolean(user.id !== undefined || auth.isAuthenticate) && (
        <Block className="relative">
          <Chip onClick={() => setPopupOpened(true)}>{user?.username || "New User"}</Chip>
        </Block>
      )}

      <Popup hidden={!popupOpened} opened={popupOpened} onBackdropClick={() => setPopupOpened(false)}>
        <Page>
          <Navbar
            title="User Menu"
            right={
              <Link navbar onClick={() => setPopupOpened(false)}>
                Close
              </Link>
            }
          />

          <Block className="space-y-4">
            <div className="flex flex-col items-center rounded-md p-4">
              <Chip>{user?.username}</Chip>
            </div>
            <div className="mt-2 border-t"></div>
            <MenuList className="flex flex-col">
              {options.map((item) => (
                <MenuListItem
                  key={item.name}
                  title={item.name}
                  media={<item.icon className="text-blue-500" aria-hidden="true" />}
                  onClick={() => goToItem(item.href)}
                />
              ))}
            </MenuList>
            <div className="mt-2 border-t"></div>
            <Button
              className="hover:no-underline hover:text-blue-500 rounded-md p-4 flex items-center gap-3"
              onClick={handleSignOut}
            >
              <FiLogOut className="text-blue-500" aria-hidden="true" />
              <span>Sign Out</span>
            </Button>
          </Block>
        </Page>
      </Popup>
    </>
  );
}
