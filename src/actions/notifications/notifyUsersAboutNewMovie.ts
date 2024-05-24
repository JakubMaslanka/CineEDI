"use server";

import { revalidateTag } from "next/cache";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { sendInAppNotification } from "@/lib/notification";
import { db } from "@/lib/db";

const getUsersByPreferredGenre = async (genres: number[]) => {
  return await db.query.usersToGenres.findMany({
    where: (schema, { inArray }) => inArray(schema.movieGenresId, genres),
    with: {
      movieGenre: true,
      user: true,
    },
  });
};

export const notifyUsersAboutNewMovie = async (
  movieTitle: string,
  genres: number[]
) => {
  let limitExceeded = false;
  await rateLimitByUserIP(10, 1000 * 60 /* 1 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

  if (genres.length === 0 || !movieTitle) {
    return { error: "Niepoprawne parametry żądania!" };
  }

  try {
    const users = await getUsersByPreferredGenre(genres);

    const userGenresMap = new Map<string, string[]>();
    users.forEach((userGenre) => {
      if (!userGenresMap.has(userGenre.userId)) {
        userGenresMap.set(userGenre.userId, []);
      }
      userGenresMap.get(userGenre.userId)!.push(userGenre.movieGenre.genre);
    });

    for (const [userId, genres] of userGenresMap) {
      const sortedGenres = genres.sort();
      const topGenre = sortedGenres[0];

      await sendInAppNotification({
        recipientUserId: userId,
        message: `Dla wszystkich miłośników gatunku "${topGenre}". Do wypożyczalni właśnie został dodany film "${movieTitle}". Myślimy, że Ci się spodoba!`,
      });
    }

    revalidateTag("notifications");
  } catch (error) {
    return {
      error:
        "Wystąpił błąd podczas powiadamiania użytkowników o nowym filmie. Spróbuj ponowanie później!",
    };
  }
};
