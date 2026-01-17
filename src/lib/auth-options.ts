import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    pages: {
        signIn: "/",
        error: "/",
    },

    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        /* -----------------------------------------
           SIGN IN
        ----------------------------------------- */
        async signIn({ user }) {
            if (!user.email) return false;

            await connectDB();

            let dbUser = await User.findOne({ email: user.email });

            if (!dbUser) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: "google",
                });
            }

            return true;
        },

        /* -----------------------------------------
           JWT (runs on EVERY request)
        ----------------------------------------- */
        async jwt({ token }) {
            if (!token.email) return token;

            await connectDB();

            const dbUser = await User.findOne({ email: token.email });

            if (dbUser) {
                token.userId = dbUser._id.toString(); // ✅ ALWAYS ATTACH
            }

            return token;
        },

        /* -----------------------------------------
           SESSION
        ----------------------------------------- */
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email as string;
                (session.user as any).id = token.userId as string; // ✅ SAFE
            }
            return session;
        },
    },
};