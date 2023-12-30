"use client";

import { Block, Button } from "konsta/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TbUser } from "react-icons/tb";

import { signIn } from "@/hooks/useUser";
import { useAppDispatch } from "@/hooks/redux";
import { setAuthenticate } from "@/redux/feature/authSlice";

export type SignInErrorTypes =
  | "Signin"
  | "EmailCreateAccount"
  | "Callback"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default";

const errorMessages: Record<SignInErrorTypes, string> = {
  Signin: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
  default: "Unable to sign in."
};

export default function Signin() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      setError(errorMessages[err]);
    }
  }, [searchParams]);

  return (
    <Block className="flex flex-col items-center justify-center p-5 m-5">
      <Block className="space-y-2">
        {/*{debug && <DebugSigninForm credentials={debug} bgColorClass={bgColorClass} />}*/}

        <SigninForm />
      </Block>
      <hr className="h-px bg-white border-1" />

      {error && (
        <Block className="text-center mt-8">
          <p className="text-orange-600">Error: {error}</p>
        </Block>
      )}
    </Block>
  );
}

interface SigninButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: ReactNode;
  title: string;
}

const SigninButton = ({ leftIcon, title }: SigninButtonProps) => {
  return (
    <Button
      className="w-full p-3 border rounded-lg flex items-center justify-center outline-none focus:border-blue-500"
      color="white"
    >
      <span className="mr-2">{leftIcon}</span>

      {title}
    </Button>
  );
};

interface SigninFormData {
  username: string;
  password: string;
}

const SigninForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<SigninFormData>();


  const signinWithCredentials: SubmitHandler<SigninFormData> = (data) => {
    signIn(data.username, data.password).then((result) => {
      if (result === "Authorized") {
        dispatch(setAuthenticate({ isAuthenticate: true, username: data.username }));
        router.push("/");
      } else {
        router.replace(`/signin?error=${result}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(signinWithCredentials)} className="rounded-md p-4 relative">
      <Block className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg outline-none text-black"
          type="text"
          placeholder="Username"
          {...register("username")}
        />
        <input
          className="w-full p-3 border rounded-lg outline-none text-black"
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <SigninButton leftIcon={<TbUser />} title={"Continue with User"} />
      </Block>
    </form>
  );
};

// interface DebugSigninFormData {
//   username: string;
//   role: Role;
// }
//
// const DebugSigninForm = ({ credentials, bgColorClass }: { credentials: ClientSafeProvider; bgColorClass: string }) => {
//   const { register, handleSubmit } = useForm<DebugSigninFormData>({
//     defaultValues: {
//       role: "general",
//       username: "dev",
//     },
//   });
//
//   function signinWithDebugCredentials(data: DebugSigninFormData) {
//     signIn(credentials.id, {
//       callbackUrl: "/dashboard",
//       ...data,
//     });
//   }
//
//   return (
//     <form
//       onSubmit={handleSubmit(signinWithDebugCredentials)}
//       className="border-2 border-orange-600 rounded-md p-4 relative"
//     >
//       <span className={`text-orange-600 absolute -top-3 left-5 ${bgColorClass} px-1`}>For Debugging Only</span>
//       <Stack>
//         <Input variant="outline" size="lg" placeholder="Username" {...register("username")} />
//         <RoleSelect {...register("role")}></RoleSelect>
//         <SigninButton leftIcon={<FaBug />}>Continue with Debug User</SigninButton>
//       </Stack>
//     </form>
//   );
// };
