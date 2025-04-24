import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user';


export const authOptions: NextAuthOptions = {
    
    providers: [
        CredentialsProvider({

            id: "Credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" },
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("User not found")
                    }

                    if (!user.isverified) {
                        throw new Error("Verify your email before login")
                    }

                    const passwordcorrect = await bcrypt.compare(credentials.password, user.password)

                    if (!passwordcorrect) {
                        throw new Error("Invalid password")
                    } else {
                        return user;
                    }

                } catch (error: any) {
                    throw new Error(error.message)
                }

            }

        })

    ],

    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isverified = user.isverified;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isverified = token.isverified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        }

    },

    pages: {
        signIn: "/signin",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,

}