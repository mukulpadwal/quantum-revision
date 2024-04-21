import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDB from "./db/connectToDB";
import User from "./models/user.model";
import conf from "./conf/conf";

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/login",
    },

    callbacks: {
        jwt({ token, user }) {
            if (user) {
                // User is available during sign-in
                token._id = user._id;
                token.username = user.username;
                token.isVerified = user.isVerified;
            }
            return token;
        },
        session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
            }

            return session;
        },
    },

    providers: [
        Credentials({
            name: "credentials",

            credentials: {
                email: {},
                password: {},
            },

            authorize: async (credentials) => {
                try {
                    await connectToDB();
                    let user = null;
                    user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        console.error("No user with this email found.")
                        return null;
                    }

                    if (!user.isVerified) {
                        console.error("Kindly verify your account first and then try to log in again.")
                        return null;
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        String(credentials.password),
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        console.error("Incorrect Password.");
                        return null;
                    }

                    return user;
                } catch (error: any) {
                    console.error("Error while loggin in the user.");
                    return null;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    secret: conf.tokenSecret,
});
