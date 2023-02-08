import { boolean } from "boolean";
import type { AuthOptions, User } from "next-auth";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";


const providers: Provider[] = [];
if (boolean(process.env.DEBUG_LOGIN) || process.env.NODE_ENV === "development") {
	providers.push(
		CredentialsProvider({
			id: "debug",
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
					role: credentials.role
				};
				return user;
			}
		})
	);
}

providers.push(
	CredentialsProvider({
		id: "server",
		name: "Credentials",
		credentials: {
			username: { label: "Username", type: "text" },
			password: { label: "Password", type: "text" }
		},
		async authorize(credentials) {
			const payload = {
				username: credentials.username,
				password: credentials.password
			};
			const res = await fetch("http://localhost:5000/api/v1/auth/login", {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json"
				}
			});
			const userWithToken = await res.json();
			if (res.ok && userWithToken) {
				const user = {
					id: userWithToken.user.username,
					sub: userWithToken.user.username,
					name: userWithToken.user.username,
					role: "general", // TODO,
					token: userWithToken.token
				};
				return user;
			}
			// Return null if user data could not be retrieved
			return null;
		}
	})
);

export const authOptions: AuthOptions = {
	providers,
	pages: {
		signIn: "/auth/signin"
		// error: "/auth/error",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				return {
					...token,
					accessToken: user.token,
					role: user.role
				};
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.name;
			session.user.role = token.role;
			session.user.name = token.name;
			session.user.accessToken = token.accessToken;
			return session;
		}
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
