import { boolean } from "boolean";
import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";


const providers: Provider[] = [];
if (boolean(process.env.DEBUG_LOGIN) || process.env.NODE_ENV === "development") {
	providers.push(
		CredentialsProvider({
			name: "Debug Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				role: { label: "Role", type: "text" }
			},
			async authorize(credentials) {
				const user = {
					id: credentials.username,
					sub: credentials.role,
					name: credentials.username,
					role: credentials.role,
				};
				return user;
			}
		})
	);
}

export const authOptions: AuthOptions = {
	providers,
	pages: {
		signIn: "/auth/signin",
		// error: "/auth/error",
	},
	callbacks: {
		async session({ session, token, user }) {
			session.user.id = token.name;
			session.user.role = token.role;
			session.user.name = token.name;
			return session;
		},
		async jwt({ token , account}) {
			token.role = "general"; // hard code role for debug user
			return token;
		},
	},
	events: {
		async signIn() {
			console.log("handle event sign in");
		},
	},
	session: {
		strategy: "jwt"
	}
};

export default NextAuth(authOptions);
