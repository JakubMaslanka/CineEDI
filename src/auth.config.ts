import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "@/lib/zod";
import { getUserByEmail } from "@/utils/db";
import { compare } from "bcrypt-ts";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user) return null;

          const passwordMatch = await compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
