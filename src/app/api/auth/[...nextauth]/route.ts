import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session as NextAuthSession, User as NextAuthUser } from "next-auth";

interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

interface Token {
  accessToken?: string;
}

interface Session extends NextAuthSession {
  accessToken?: string;
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "example-oauth2",
      name: "Example OAuth2",
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Credentials are missing");
        }

        try {
          const res = await fetch("https://uat-beta-auto.pcrsdev.com/Pcmi.Web.Sts/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: "MAGN",
              client_secret: "12345",
              username: credentials.email,
              password: credentials.password,
              grant_type: "password",
            }),
          });

          const text = await res.text();
          console.log("Response text:", text); // Log the response text

          const data = JSON.parse(text);

          if (res.ok && data.access_token) {
            return {
              id: data.user_id,
              name: data.user_name,
              email: credentials.email,
              accessToken: data.access_token,
            };
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw new Error("Authentication failed");
        }
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | NextAuthUser }) {
      if (user) {
        token.accessToken = (user as User).accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = (token as Token).accessToken;
      return session;
    },
  },
};

// Export named handlers for each HTTP method
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);