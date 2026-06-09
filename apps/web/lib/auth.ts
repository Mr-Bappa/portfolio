import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { supabaseAdmin } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user }) {
      const db = supabaseAdmin();

      const { error } = await db.from("profiles").upsert(
        {
          email: user.email,
          name: user.name,
          avatar_url: user.image,
        },
        { onConflict: "email", ignoreDuplicates: false }
      );

      if (error) console.error("Profile upsert error:", error);

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const db = supabaseAdmin();

        const { data } = await db
          .from("profiles")
          .select("id, role")
          .eq("email", user.email!)
          .single();

        if (data) {
          token.profileId = data.id;
          token.role = data.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.profileId = token.profileId as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};