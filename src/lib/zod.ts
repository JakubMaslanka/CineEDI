import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email jest wymagany" })
    .min(1, "Email jest wymagany")
    .email("Nieprawidłowy email"),
  password: string({ required_error: "Hasło jest wymagane" })
    .min(1, "Hasło jest wymagane")
    .min(8, "Hasło musi zawierać przynajmniej 8 znaków")
    .max(32, "Hasło musi zawierać mniej niż 32 znaki"),
});

export const signUpSchema = object({
  email: string({ required_error: "Email jest wymagany" })
    .min(1, "Email jest wymagany")
    .email("Nieprawidłowy email"),
  password: string({ required_error: "Hasło jest wymagane" })
    .min(1, "Hasło jest wymagane")
    .min(8, "Hasło musi zawierać przynajmniej 8 znaków")
    .max(32, "Hasło musi zawierać mniej niż 32 znaki"),
  name: string().min(1, { message: "Nazwa użytkownika jest wymagana" }),
});

export const resetPasswordSchema = object({
  email: string({ required_error: "Email jest wymagany" })
    .min(1, "Email jest wymagany")
    .email("Nieprawidłowy email"),
});

export const newPasswordSchema = object({
  password: string({ required_error: "Hasło jest wymagane" })
    .min(1, "Hasło jest wymagane")
    .min(8, "Hasło musi zawierać przynajmniej 8 znaków")
    .max(32, "Hasło musi zawierać mniej niż 32 znaki"),
});
