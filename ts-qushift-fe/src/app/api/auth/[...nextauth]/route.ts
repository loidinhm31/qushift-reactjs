import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth";

import { providers } from "@/lib/option";

export const authOptions: AuthOptions = {
  providers: providers,
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.name!;
      session.user.role = token.role!;
      session.user.name = token.name;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  events: {
    async signIn() {
      console.log("handle event sign in");
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
