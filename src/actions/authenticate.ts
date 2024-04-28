"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt-ts";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  passwordResetTokens,
  users,
  verificationTokens,
} from "@/lib/db.schema";
import { sendVerificationEmail, sendResetPasswordEmail } from "@/lib/mail";
import {
  generateResetPasswordToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  newPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/zod";
import {
  getPasswordResetTokenByToken,
  getUserByEmail,
  getVerificationTokenByToken,
} from "@/utils/db";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";

export const signInAction = async (
  values: z.infer<typeof signInSchema>,
  callbackUrl?: string
) => {
  const validatedFields = signInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Poświadczenia nie spełniają wymaganych kryteriów!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl === "/" ? DEFAULT_LOGIN_REDIRECT : callbackUrl,
    });
    return { success: "Logowanie przebiegło pomyślnie!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nieprawidłowe dane logowania!" };
        case "AuthorizedCallbackError":
          return { error: "Email nie został zweryfikowany!" };
        default:
          return { error: "Coś poszło nie tak!" };
      }
    }

    throw error;
  }
};

export const signUpAction = async (values: z.infer<typeof signUpSchema>) => {
  const validatedFields = signUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Pola nie spełniają wymagnaych kryteriów!" };
  }

  const { email, name, password } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (user) {
    return { error: "Podany email jest już używany!" };
  }

  const hashedPassword = await hash(password, 10);
  const newUser = await db
    .insert(users)
    .values({
      email,
      name,
      password: hashedPassword,
      image: "https://api.dicebear.com/8.x/fun-emoji/svg",
    })
    .returning();

  const verificationToken = await generateVerificationToken(newUser?.[0].email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Konto zostało utworzone! Sprawdź swoją skrzynkę mailową.",
  };
};

export const sendResetPasswordEmailAction = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  const validatedFields = resetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Adres e-mail nie spełniają wymagnaych kryteriów!" };
  }

  const { email } = validatedFields.data;
  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "Podany email nie istnieje!" };
  }

  const passwordResetToken = await generateResetPasswordToken(user.email);
  await sendResetPasswordEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success: "Email został wysłany!",
  };
};

export const emailVerificationResendAction = async (email: string) => {
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

export const emailVerificationAction = async (token: string) => {
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

  return { success: "Email został zweryfikowany!" };
};

export const updatePasswordAction = async (
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
    return { error: "Email nie istnieje!" };
  }

  const hashedPassword = await hash(password, 10);
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, existingToken.id));

  return { success: "Hasło zostało zmienione!" };
};
