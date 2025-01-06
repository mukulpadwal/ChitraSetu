import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDB } from "./lib/db";
import { User as UserModel } from "./models";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { type: "text", label: "Email" },
        password: { type: "password", label: "Password" },
      },
      authorize: async (
        credentials: Partial<Record<"email" | "password", unknown>>
      ): Promise<User | null> => {
        await connectToDB();

        try {
          const { email, password } = credentials;

          if (
            [email, password].some(
              (field) =>
                field === undefined ||
                (typeof field === "string" && field.trim() === "")
            )
          ) {
            throw new Error("Email and Password are required...");
          }

          const user = await UserModel.findOne({ email });

          if (!user) {
            throw new Error("No user with this email exists...");
          }

          const isPasswordValid = await user.isPasswordValid(password);

          if (!isPasswordValid) {
            throw new Error("Invalid password...");
          }

          return {
            id: user?._id?.toString(),
            email: user?.email,
            role: user?.role,
          };
        } catch (error) {
          console.error("Auth JS Login Error...", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
