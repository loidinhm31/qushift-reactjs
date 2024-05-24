import { boolean } from "boolean";
import { Block, Button, Link } from "konsta/react";
import { useRouter } from "next/navigation";
import React from "react";
import { TbUser } from "react-icons/tb";
import { useAppSelector } from "@/hooks/redux";
import { useUser } from "@/hooks/useUser";

export default function AccountButton() {
  const { defaultUser } = useUser();
  const auth = useAppSelector((state) => state.authReducer);

  const router = useRouter();

  return (
    <div>
      {boolean(defaultUser.id === undefined && !auth.isAuthenticate) && (
        <Link onClick={() => router.push("/signin")} aria-label="Home">
          <Block className="flex items-center">
            <Button className="border border-gray-600 text-gray-600 px-4 py-2 flex items-center space-x-2">
              <TbUser className="w-4 h-4" />
              <p className="p-1">Sign in</p>
            </Button>
          </Block>
        </Link>
      )}
    </div>
  );
}
