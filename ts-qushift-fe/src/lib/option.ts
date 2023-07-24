import { Provider } from "next-auth/providers";
import { boolean } from "boolean";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultUser } from "next-auth";

export const providers: Provider[] = [];

if (boolean(process.env.DEBUG_LOGIN) || process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      id: "debug",
      name: "Debug Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const user: DefaultUser = {
          id: credentials?.username!,
          name: credentials?.username,
          role: credentials?.role,
          token: "",
        };
        return user;
      },
    }),
  );
}

providers.push(
  CredentialsProvider({
    id: "server",
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "text" },
    },
    async authorize(credentials) {
      const payload = {
        username: credentials?.username,
        password: credentials?.password,
      };
      const res = await fetch(`${process.env.AUTH_API_URL}/api/v1/auth/login`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userWithToken = await res.json();
      if (res.ok && userWithToken) {
        const user: DefaultUser = {
          id: userWithToken.user.username,
          name: userWithToken.user.username,
          role: "general", // TODO,
          token: userWithToken.token,
        };
        return user;
      }
      // Return null if user data could not be retrieved
      return null;
    },
  }),
);