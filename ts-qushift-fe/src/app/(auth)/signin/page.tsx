"use client";

import { Button, ButtonProps, Input, Stack, useColorMode, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBug, FaEnvelope, FaUser } from "react-icons/fa";
import { ClientSafeProvider, signIn } from "next-auth/react";
import { Role, RoleSelect } from "@/components/RoleSelect";

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
  default: "Unable to sign in.",
};

export default function Signin() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      if (typeof err === "string") {
        setError(errorMessages[err]);
      } else {
        setError(errorMessages[err[0]]);
      }
    }
  }, [searchParams]);

  const { colorMode } = useColorMode();
  const bgColorClass = colorMode === "light" ? "bg-gray-50" : "bg-chakra-gray-900";

  return (
    <div className={bgColorClass}>
      <Head>
        <title>Sign Up</title>
        <meta name="Sign Up" content="Sign up" />
      </Head>
      <Stack spacing="2">
        {/*{debug && <DebugSigninForm credentials={debug} bgColorClass={bgColorClass} />}*/}

        <SigninForm bgColorClass={bgColorClass} />
      </Stack>
      <hr className="mt-14 mb-4 h-px bg-gray-200 border-0" />

      {error && (
        <div className="text-center mt-8">
          <p className="text-orange-600">Error: {error}</p>
        </div>
      )}
    </div>
  );
}

const SigninButton = (props: ButtonProps) => {
  const buttonColorScheme = useColorModeValue("blue", "dark-blue-btn");

  return (
    <Button
      size={"lg"}
      leftIcon={<FaEnvelope />}
      type="submit"
      colorScheme={buttonColorScheme}
      color="white"
      {...props}
    ></Button>
  );
};

interface SigninFormData {
  username: string;
  password: string;
}

const SigninForm = ({ bgColorClass }: { bgColorClass: string }) => {
  const { register, handleSubmit } = useForm<SigninFormData>();

  function signinWithCredentials(data: SigninFormData) {
    signIn("server", {
      callbackUrl: "/dashboard",
      ...data,
    });
  }

  return (
    <form onSubmit={handleSubmit(signinWithCredentials)} className="rounded-md p-4 relative">
      <Stack>
        <Input variant="outline" size="lg" placeholder="Username" {...register("username")} />
        <Input variant="outline" size="lg" placeholder="Password" type="password" {...register("password")} />

        <SigninButton leftIcon={<FaUser />}>Continue with User</SigninButton>
      </Stack>
    </form>
  );
};

interface DebugSigninFormData {
  username: string;
  role: Role;
}

const DebugSigninForm = ({ credentials, bgColorClass }: { credentials: ClientSafeProvider; bgColorClass: string }) => {
  const { register, handleSubmit } = useForm<DebugSigninFormData>({
    defaultValues: {
      role: "general",
      username: "dev",
    },
  });

  function signinWithDebugCredentials(data: DebugSigninFormData) {
    signIn(credentials.id, {
      callbackUrl: "/dashboard",
      ...data,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(signinWithDebugCredentials)}
      className="border-2 border-orange-600 rounded-md p-4 relative"
    >
      <span className={`text-orange-600 absolute -top-3 left-5 ${bgColorClass} px-1`}>For Debugging Only</span>
      <Stack>
        <Input variant="outline" size="lg" placeholder="Username" {...register("username")} />
        <RoleSelect {...register("role")}></RoleSelect>
        <SigninButton leftIcon={<FaBug />}>Continue with Debug User</SigninButton>
      </Stack>
    </form>
  );
};
