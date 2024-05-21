import { Resend } from "resend";
import { env } from "@/env";

import ResetPasswordEmail from "../../emails/auth/reset-password-email";
import VerifyEmail from "../../emails/auth/verify-email";
import RentStartEmail from "../../emails/rental/rent-start-email";
import RentEndEmail from "../../emails/rental/rent-end-email";

const resend = new Resend(env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${env.AUTH_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    to: email,
    from: "no-reply@cineedi.online",
    subject: "[CineEDI] Resetowanie hasła do platformy",
    react: <ResetPasswordEmail resetPasswordLink={resetLink} />,
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
    react: <VerifyEmail confirmLink={confirmLink} />,
  });

  console.info(
    `[${new Date().toDateString()}] The verification email has been sent to: ${email}`
  );
};

export const sendMovieRentStartEmail = async (
  addressEmail: string,
  content: {
    rentId: number;
    ediString: string;
    movieTitle: string;
    userName: string;
    directorName: string;
    rentStartDate: string;
    rentEndDate: string;
    rating: string;
    imageUrl: string;
  }
) => {
  const rentStatusLink = `${env.AUTH_URL}/rent-status/${content.rentId}`;

  await resend.emails.send({
    to: addressEmail,
    from: "no-reply@cineedi.online",
    subject: `[CineEDI] Właśnie wypożyczyłeś film "${content.movieTitle}"`,
    react: (
      <RentStartEmail
        rentStatusLink={rentStatusLink}
        movieTitle={content.movieTitle}
        userName={content.userName}
        directorName={content.directorName}
        rentStartDate={content.rentStartDate}
        rentEndDate={content.rentEndDate}
        rating={content.rating}
        imageUrl={content.imageUrl}
      />
    ),
    attachments: [
      {
        filename: `transaction_${content.rentId}.edi`,
        content: Buffer.from(content.ediString, "utf-8").toString("base64"),
      },
    ],
  });

  console.info(
    `[${new Date().toDateString()}] The email for the movie rent process has been sent to: ${addressEmail}`
  );
};

export const sendMovieRentEndEmail = async (
  addressEmail: string,
  content: {
    rentId: number;
    movieTitle: string;
    userName: string;
  }
) => {
  const homeLink = `${env.AUTH_URL}/home`;

  await resend.emails.send({
    to: addressEmail,
    from: "no-reply@cineedi.online",
    subject: `[CineEDI] Twoje wypożyczenie filmu "${content.movieTitle}" właśnie dobiego końca`,
    react: (
      <RentEndEmail
        homeLink={homeLink}
        movieTitle={content.movieTitle}
        userName={content.userName}
        rentId={content.rentId}
      />
    ),
  });

  console.info(
    `[${new Date().toDateString()}] The email with the rent status ended has been sent to: ${addressEmail}`
  );
};
