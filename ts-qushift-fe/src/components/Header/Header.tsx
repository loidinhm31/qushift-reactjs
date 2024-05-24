import { boolean } from "boolean";
import { Block, Button, Dialog, DialogButton, Navbar } from "konsta/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TbMenu } from "react-icons/tb";

import AccountButton from "@/components/Header/Account";
import { UserMenu } from "@/components/Header/UserMenu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useUser } from "@/hooks/useUser";
import { resetDialog } from "@/redux/feature/dialogSlice";

interface HeaderProps {
  setLeftPanelOpened?: (flag: boolean) => void;
}

export function Header({ setLeftPanelOpened }: HeaderProps) {
  const homeURL = useUser() ? "/dashboard" : "/";

  const dialog = useAppSelector((state) => state.dialogReducer);
  const dispatch = useAppDispatch();

  return (
    <>
      <Navbar
        title={"QuShift"}
        className="basis-auto"
        left={
          <Link href={homeURL} aria-label="Dashboard">
            <div className="flex items-center">
              <Image src="/images/logos/logo.svg" className="mx-auto object-fill" width="50" height="50" alt="logo" />
            </div>
          </Link>
        }
      >
        <div className="flex items-center justify-between w-screen">
          <Block strongIos outlineIos className="flex space-x-4 rtl:space-x-reverse">
            {boolean(setLeftPanelOpened !== undefined) && (
              <Button rounded onClick={() => setLeftPanelOpened!(true)}>
                <TbMenu />
              </Button>
            )}
          </Block>

          <div className="flex items-center">
            <AccountButton />
            <UserMenu />
          </div>
        </div>
      </Navbar>

      <Dialog
        opened={dialog.isOpen}
        onBackdropClick={() => dispatch(resetDialog())}
        title={dialog.title}
        content={dialog.dialogNode}
        buttons={
          <>
            <DialogButton onClick={() => dispatch(resetDialog())}>Cancel</DialogButton>
          </>
        }
      />
    </>
  );
}
