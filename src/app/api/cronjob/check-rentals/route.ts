import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { db } from "@/lib/db";
import { rentals as rentalsSchema } from "@/lib/db.schema";
import { sendMovieRentEndEmail } from "@/lib/mail";
import { sendInAppNotification } from "@/lib/notification";
import { rateLimitByUserIP } from "@/lib/rateLimiter";

export async function POST() {
  let limitExceeded = false;
  await rateLimitByUserIP(2, 1000 * 60 * 60 /* 1 hour */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return NextResponse.json({
      status: 429,
      message: "Limit of requests has been reached!",
    });
  }

  const apiKeyFromHeader = headers().get("x-cronjob-api-key");

  if (apiKeyFromHeader !== env.CRONJOB_API_KEY) {
    return NextResponse.json({
      status: 403,
      message: "Authorization failed! Operation aborted.",
    });
  }

  try {
    const rentalsWithPeriodEnd = await db.query.rentals.findMany({
      where: (schema, { and, eq, lte }) =>
        and(
          eq(schema.status, "rented"),
          lte(schema.rental_end_date, new Date())
        ),
      with: {
        user_id: true,
        movie_id: true,
      },
    });

    if (rentalsWithPeriodEnd.length === 0) {
      return NextResponse.json({
        status: 200,
        message: "No rentals with period end.",
      });
    }

    rentalsWithPeriodEnd.forEach(async ({ id, user_id, movie_id }) => {
      await db
        .update(rentalsSchema)
        .set({ status: "ended" })
        .where(eq(rentalsSchema.id, id));

      await sendInAppNotification({
        recipientUserId: user_id.id,
        message: `Twoje wypożyczenie filmu "${movie_id.title}" dobiego końca.`,
      });

      if (!!user_id.emailVerified) {
        await sendMovieRentEndEmail(user_id.email, {
          rentId: id,
          movieTitle: movie_id.title,
          userName: user_id.name!,
        });
      }
    });

    return NextResponse.json({
      status: 200,
      message: `Rented movies checked successfully! Updated rentals ids: ${rentalsWithPeriodEnd
        .map(({ id }) => id)
        .join(", ")}.`,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "There was an error while checking rented movies!",
    });
  }
}
