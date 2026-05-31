import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// AUTH_SECRET, AUTH_GITHUB_ID, and AUTH_GITHUB_SECRET are read automatically
// from the environment (see .env.local).
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
});
