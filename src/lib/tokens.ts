import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { verificationTokens, passwordResetTokens } from "@/lib/db.schema";
import {
  getPasswordResetTokenByEmail,
  getVerificationTokenByEmail,
} from "@/utils/db";

export const generateResetPasswordToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000 /* 1 hour **/);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  const result = await db
    .insert(passwordResetTokens)
    .values({ token, email, expires_at: expires })
    .returning();

  return result[0];
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000 /* 1 hour **/);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  const result = await db
    .insert(verificationTokens)
    .values({ token, email, expires_at: expires })
    .returning();

  return result[0];
};
