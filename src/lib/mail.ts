import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${env.AUTH_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    to: email,
    from: "no-reply@cineedi.online",
    subject: "[CineEDI] Resetowanie hasła do platformy",
    html: `<a href="${resetLink}">Reset your password</a>`,
  });

  console.info(
    `[${new Date().toDateString()}] The email for the password reset process has been sent to: ${email}`
  );
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${env.AUTH_URL}/auth/email-verification?token=${token}`;

  await resend.emails.send({
    to: email,
    from: "no-reply@cineedi.online",
    subject: "[CineEDI] Zweryfikuj swój adres email",
    html: `<a href="${confirmLink}">Verify your email address</a>`,
  });

  console.info(
    `[${new Date().toDateString()}] The verification email has been sent to ${email}`
  );
};
