"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { hash } from "bcrypt-ts";
import { db } from "@/lib/db";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { sendResetPasswordEmail } from "@/lib/mail";
import { passwordResetTokens, users } from "@/lib/db.schema";
import { generateResetPasswordToken } from "@/lib/tokens";
import { newPasswordSchema, resetPasswordSchema } from "@/lib/zod";
import { getPasswordResetTokenByToken, getUserByEmail } from "@/utils/db";

export const sendResetPasswordEmailAction = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  let limitExceeded = false;
  await rateLimitByUserIP(1, 1000 * 60 * 5 /* 5 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

  const validatedFields = resetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Adres e-mail nie spełniają wymagnaych kryteriów!" };
  }

  const { email } = validatedFields.data;
  const user = await getUserByEmail(email);

  if (!user) {
    return {
      error:
        "Coś poszło nie tak. Upewnij się, że podany email jest prawidłowy.",
    };
  }

  const passwordResetToken = await generateResetPasswordToken(user.email);
  await sendResetPasswordEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success: "Email z linkiem do resetu hasła został wysłany!",
  };
};

export const resetPasswordAction = async (
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Niepoprawny token!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Hasło nie spełnia wymagnaych kryteriów!" };
  }

  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Niepoprawny token!" };
  }

  const hasExpired = new Date(existingToken.expires_at) < new Date();

  if (hasExpired) {
    return { error: "Token wygasł!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error:
        "Coś poszło nie tak. Upewnij się, że podany email jest prawidłowy.",
    };
  }

  const hashedPassword = await hash(password, 10);
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, existingToken.id));

  console.info(
    `[${new Date().toDateString()}] The password reset process has been successfully completed for the user with the email: ${
      existingUser.email
    }`
  );

  return { success: "Hasło zostało zmienione!" };
};
