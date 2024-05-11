"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { signIn } from "@/lib/auth";
import { signInSchema } from "@/lib/zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const signInAction = async (
  values: z.infer<typeof signInSchema>,
  callbackUrl?: string
) => {
  let limitExceeded = false;
  await rateLimitByUserIP(10, 1000 * 60 /* 1 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

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
