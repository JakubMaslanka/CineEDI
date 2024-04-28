import { z } from "zod";
import { hash } from "bcrypt-ts";
import { db } from "@/lib/db";
import { users } from "@/lib/db.schema";
import { signUpSchema } from "@/lib/zod";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getUserByEmail } from "@/utils/db";

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
