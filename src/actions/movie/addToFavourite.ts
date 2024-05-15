"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { favorites as favoritesSchema } from "@/lib/db.schema";
import { rateLimitByUserIP } from "@/lib/rateLimiter";

import { removeFromFavouriteAction } from "./removeFromFavourite";

export const addToFavouriteAction = async (movieId: number) => {
  let limitExceeded = false;
  await rateLimitByUserIP(10, 1000 * 60 /* 1 min */).catch(() => {
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

    const removeIfAlreadyExist = await removeFromFavouriteAction(movieId);

    if (removeIfAlreadyExist.error) {
      return removeIfAlreadyExist;
    }

    await db.insert(favoritesSchema).values({
      movie_id: movieId,
      user_id: userId,
    });

    revalidatePath(`/movie/${movieId}`);
    return { success: "Pomyślnie, dodano film do Twojej listy!" };
  } catch (error) {
    return { error: "Wystąpił błąd podczas dodawania filmu do Twojej listy!" };
  }
};
