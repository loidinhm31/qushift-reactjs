import { useEffect, useState } from "react";

import { authLogin } from "@/service/auth";
import { AuthData, DefaultUser } from "@/types/DefaultUser";

export const useUser = (): AuthData => {
  const [user, setUser] = useState<DefaultUser>({});
  const [status, setStatus] = useState("loading");
  const [authData, setAuthData] = useState<AuthData>({
    status: status,
    defaultUser: user,
  });

  useEffect(() => {
    if (!localStorage) {
      setStatus("loading");
    } else {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
      setStatus("done");
    }
  }, []);

  useEffect(() => {
    setAuthData({
      status: status,
      defaultUser: user,
    });
  }, [status, user]);

  return authData;
};

export const signIn = async (username: string, password: string): Promise<string> => {
  const payload = {
    username: username,
    password: password,
  };

  try {
    const res = await authLogin(payload);

    if (res.status === 200) {
      const userWithToken = await res.json();

      if (userWithToken) {
        const user: DefaultUser = {
          id: userWithToken.user.username,
          username: userWithToken.user.username,
          role: "general", // TODO,
          accessToken: userWithToken.token,
        };

        localStorage.setItem("user", JSON.stringify(user));

        return "Authorized";
      }
    }
  } catch (e) {
    return "default";
  }
  return "CredentialsSignin";
};
