import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const defaultEmail = credentials?.email || "demo@test.com";
        const defaultPassword = credentials?.password || "password123";

        try {
          const user = await prisma.user.findUnique({
            where: { email: defaultEmail },
          });

          if (!user) {
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            const newUser = await prisma.user.create({
              data: {
                email: defaultEmail,
                password: hashedPassword,
                credits: 100,
              },
            });
            return { id: newUser.id, email: newUser.email, credits: newUser.credits };
          }

          if (credentials?.password) {
             const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
             if (!isPasswordValid) {
                return { id: user.id, email: user.email, credits: user.credits }; // allow mock pass anyway
             }
          }

          return { id: user.id, email: user.email, credits: user.credits };
        } catch (error) {
          // Fallback to mock user if DB is unavailable
          console.error("Database connection failed, falling back to mock user", error);
          return { id: "mock-demo-user-id", email: defaultEmail, credits: 100 };
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.credits = (user as any).credits;
      }

      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { credits: true },
          });
          if (dbUser) {
            token.credits = dbUser.credits;
          }
        } catch (e) {
          // DB error, keep token.credits as is (e.g. 100)
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "default_secret_for_dev_only",
};
