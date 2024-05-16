"use server";

import { add } from "date-fns/add";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { sendMovieRentStartEmail } from "@/lib/mail";
import { sendInAppNotification } from "@/lib/notification";
import { getUserById } from "@/utils/db";
import { db } from "@/lib/db";
import {
  rentals as rentalsSchema,
  ediTransactions as ediTransactionsSchema,
} from "@/lib/db.schema";

export const rentMovieAction = async (movieId: number) => {
  let limitExceeded = false;
  await rateLimitByUserIP(5, 1000 * 60 * 5 /* 5min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded)
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };

  if (!movieId) return { error: "Niepoprawne parametry żądania!" };

  try {
    const session = await auth();
    if (!session) return { error: "Nie jesteś zalogowany!" };

    const movie = await db.query.movies.findFirst({
      where: (schema, { eq }) => eq(schema.id, movieId),
    });
    if (!movie) return { error: "Nie znaleziono filmu do wypożyczenia!" };

    const user = await getUserById(session.user.id);
    if (!user) return { error: "Nie jesteś zalogowany!" };

    // TODO: Create EDI file
    const ediTransaction = await db
      .insert(ediTransactionsSchema)
      .values({
        content: JSON.stringify({}),
      })
      .returning();
    if (!ediTransaction[0])
      return {
        error: "Ops! Coś poszło nie tak podczas próby wypożyczenia filmu.",
      };

    const rentDetails = await db
      .insert(rentalsSchema)
      .values({
        rental_date: new Date(),
        rental_end_date: add(new Date(), { days: 1 }),
        movie_id: movie.id,
        user_id: user.id,
        edi_transaction_id: ediTransaction[0].id,
      })
      .returning();
    if (!rentDetails[0])
      return {
        error: "Ops! Coś poszło nie tak podczas próby wypożyczenia filmu.",
      };
    const rent = rentDetails[0];

    await sendInAppNotification({
      recipientUserId: user.id,
      message: `Pomyślnie, udało Ci się wypożyczyć film "${movie.title}". Udanego seansu!`,
    });
    if (!!user.emailVerified) {
      await sendMovieRentStartEmail(user.email, {
        id: rent.id,
        movieTitle: movie.title,
      });
    }

    console.info(
      `[${new Date().toDateString()}] Movie with id ${
        movie.id
      } has been rented by user with id ${user.id} successfully`
    );

    revalidatePath(`/movie/${movieId}`);

    return {
      success: {
        message: `Pomyślnie, udało Ci się wypożyczyć film "${movie.title}". Udanego seansu!`,
        rentId: rent.id,
      },
    };
  } catch (error) {
    return {
      error: "Ops! Coś poszło nie tak podczas próby wypożyczenia filmu.",
    };
  }
};
