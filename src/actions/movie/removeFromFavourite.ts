"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { favorites as favoritesSchema } from "@/lib/db.schema";
import { rateLimitByUserIP } from "@/lib/rateLimiter";

export const removeFromFavouriteAction = async (movieId: number) => {
  let limitExceeded = false;
  await rateLimitByUserIP(20, 1000 * 60 /* 1 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

  if (!movieId) {
    return { error: "Niepoprawne parametry żądania!" };
  }

  try {
    const session = await auth();

    if (!session) {
      return { error: "Nie jesteś zalogowany!" };
    }

    const userId = session.user.id;

    await db
      .delete(favoritesSchema)
      .where(
        and(
          eq(favoritesSchema.movie_id, movieId),
          eq(favoritesSchema.user_id, userId)
        )
      );

    revalidatePath(`/movie/${movieId}`);
    return { success: "Pomyślnie, usunięto film z Twojej listy!" };
  } catch (error) {
    return { error: "Wystąpił błąd podczas usuwania filmu z Twojej listy!" };
  }
};
