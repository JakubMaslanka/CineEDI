"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db.schema";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail, getVerificationTokenByToken } from "@/utils/db";

export const sendEmailVerifyLinkAction = async (email: string) => {
  let limitExceeded = false;
  await rateLimitByUserIP(1, 1000 * 60 * 5 /* 5 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error:
        "Coś poszło nie tak. Upewnij się, że podany email jest prawidłowy.",
    };
  }

  const verificationToken = await generateVerificationToken(existingUser.email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: `Email weryfikacyjny został wysłany ponowanie na adres: ${verificationToken.email}`,
  };
};

export const emailVerifyAction = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error:
        "Coś poszło nie tak. Upewnij się, że podany email jest prawidłowy.",
    };
  }

  const hasExpired = new Date(existingToken.expires_at) < new Date();

  if (hasExpired) {
    return { error: "Token wygasł!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email nie istnieje!" };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: existingToken.email })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, existingToken.token));

  console.info(
    `[${new Date().toDateString()}] The email verification process was successful for the email address: ${
      existingToken.email
    }`
  );

  return { success: "Email został zweryfikowany!" };
};
