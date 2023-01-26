import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
            id: string;
			/** The user's role. */
			role: string;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
        id: string;
		/** The user's role. */
		role?: string;
	}
}
