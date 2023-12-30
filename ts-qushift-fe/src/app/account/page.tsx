"use client";

import { Block } from "konsta/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

import { useUser } from "@/hooks/useUser";

export default function Account() {
  const { status, defaultUser: user } = useUser();

  useEffect(() => {
    if (status !== "loading" && user && !user.id) {
      redirect("/signin");
    }
  }, [status, user]);

  return (
    <>
      <div className="max-w-7xl">
        <div className="p-4 sm:p-6 w-full">
          <p>Your Account</p>
          <div />
          <Block>
            <p>ID</p>
            <p>{user?.id ?? "(No ID)"}</p>
            <p>Username</p>
            <div>
              {user?.username ?? "(No username)"}
              <Link href="/account/edit">
                {/*<Icon boxSize={5} as={MdOutlineEdit} />*/}
                Edit
              </Link>
            </div>
            <p>Email</p>
            <p>{user?.username ?? "(No Email)"}</p>
          </Block>
          <p></p>
        </div>
      </div>
    </>
  );
}
