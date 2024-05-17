import { Resend } from "resend";
import { env } from "@/env";

import ResetPasswordEmail from "../../emails/auth/reset-password-email";
import VerifyEmail from "../../emails/auth/verify-email";
import RentStartEmail from "../../emails/rental/rent-start-email";

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

interface RentDetails {
  id: number;
  movieTitle: string;
}

export const sendMovieRentStartEmail = async (
  addressEmail: string,
  content: {
    rentId: number;
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
  });

  console.info(
    `[${new Date().toDateString()}] The email for the movie rent process has been sent to: ${addressEmail}`
  );
};
