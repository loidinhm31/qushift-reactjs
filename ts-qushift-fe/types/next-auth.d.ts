import { DefaultSession } from "next-auth";
import { NextApiResponse } from "next";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			accessToken: string;
			role: string;
		} & DefaultSession["user"];
	}
}
;

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		accessToken: string;
		role?: string;
	}
}
;

declare module "next-auth/core/types" {
	interface DefaultUser {
		id: string;
		token: string;
		role?: string;
	}
}
;

declare type ApiResponse<T = any> = NextApiResponse & {
	flush();
	flushData(data: string);
};