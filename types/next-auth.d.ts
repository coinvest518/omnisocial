// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add accessToken to session type
    user: {
      thumbnails: any;
      hashtags: any;
      credits: ReactI18NextChildren;
      id: string; // Ensure the User interface includes id
      email: string;
      name?: string | null; // Optional fields
      image?: string | null; // Optional fields
    };
  }

  interface User {
    id: string; // Add id to User interface
    email: string;
    name?: string | null; // Optional fields
    image?: string | null; // Optional fields
  }

 
}
