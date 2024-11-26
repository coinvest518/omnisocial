import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "../../../lib/dbConnect";
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import TwitterProvider from 'next-auth/providers/twitter';
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (user && (await bcrypt.compare(password, user.password))) {
          return { id: user._id.toString(), email: user.email };
        }

        return null;
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
    }),  

    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    }),
    


    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube",
        },
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id; // Ensure user.id is set in the session

        // Check if the user exists in the database
        const dbUser  = await User.findById(user.id);
        
        if (dbUser ) {
          // If the user does not have credits, set them to 10
          if (dbUser .credits === undefined) {
            dbUser .credits = 10; // Set default credits
            await dbUser .save(); // Save the new credits to the database
          }
          session.user.credits = dbUser .credits; // Attach credits to the session
        } else {
          // If the user does not exist, create a new user with default credits
          const newUser  = new User({
            email: user.email,
            credits: 10, // Set default credits
          });
          await newUser .save(); // Save the new user to the database
          session.user.credits = newUser .credits; // Attach credits to the session
        }
      }
      return session;
    },
  },

  session: {
    strategy: "database", // Use database sessions instead of JWT
  },

  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);