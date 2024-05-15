"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  usersToGenres as usersToGenresSchema,
  users as usersSchema,
} from "@/lib/db.schema";

export const saveGenrePreferencesAction = async (genreIds: number[]) => {
  let limitExceeded = false;
  await rateLimitByUserIP(3, 1000 * 60 /* 1 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

  if (genreIds.length <= 0) {
    return { error: "Niepoprawne parametry żądania!" };
  }

  try {
    const session = await auth();

    if (!session) {
      return { error: "Nie jesteś zalogowany!" };
    }

    const userId = session.user.id;

    await db.insert(usersToGenresSchema).values(
      genreIds.map((genre) => ({
        userId: userId,
        movieGenresId: genre,
      }))
    );

    await db
      .update(usersSchema)
      .set({ firstTimeLoggedIn: false })
      .where(eq(usersSchema.id, userId));

    revalidatePath(`/home`);
    return {
      success: "Pomyślnie, zapisano Twoje preferowane gatunki filmowe!",
    };
  } catch (error) {
    return {
      error:
        "Wystąpił błąd podczas zapisywania Twoich preferowanych gatunków filmowych!",
    };
  }
};
