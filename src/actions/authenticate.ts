"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { hash } from "bcrypt-ts";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db.schema";
import { signInSchema, signUpSchema } from "@/lib/zod";
import { getUserByEmail } from "@/utils/db";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";

export const signInAction = async (values: z.infer<typeof signInSchema>) => {
  const validatedFields = signInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Poświadczenia nie spełniają wymaganych kryteriów!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Logowanie przebiegło pomyślnie!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nieprawidłowe dane logowania!" };
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
  await db.insert(users).values({
    email,
    name,
    password: hashedPassword,
    image: "https://api.dicebear.com/8.x/fun-emoji/svg",
  });

  // TODO: send email to verify account

  return { success: "Konto zostało utworzone! Zaloguj się." };
};
