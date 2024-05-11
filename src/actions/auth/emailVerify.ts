import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db.schema";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail, getVerificationTokenByToken } from "@/utils/db";

export const sendEmailVerifyLinkAction = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Podany email nie istnieje!" };
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
    return { error: "Podany token nie istnieje!" };
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

  setTimeout(() => {
    redirect("/auth/sign-in");
  }, 4000);

  return { success: "Email został zweryfikowany!" };
};
