import { createTransport } from "nodemailer";
import { env } from "@/env";

export const transporter = () => {
  return createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
};
