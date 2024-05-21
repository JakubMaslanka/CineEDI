"use server";

import { revalidateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications as notificationsSchema } from "@/lib/db.schema";
import { rateLimitByUserIP } from "@/lib/rateLimiter";

export const markNotificationAsSeenAction = async (notificationId: number) => {
  let limitExceeded = false;
  await rateLimitByUserIP(50, 1000 * 60 /* 5 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

  if (!notificationId) {
    return { error: "Niepoprawne parametry żądania!" };
  }

  try {
    const session = await auth();

    if (!session) {
      return { error: "Nie jesteś zalogowany!" };
    }

    const userId = session.user.id;

    await db
      .update(notificationsSchema)
      .set({ status: "received" })
      .where(
        and(
          eq(notificationsSchema.user_id, userId),
          eq(notificationsSchema.id, notificationId)
        )
      );

    const updatedNotifications = await db.query.notifications.findMany({
      where: (schema, { eq }) => eq(schema.user_id, userId),
      orderBy: (schema, { desc }) => desc(schema.notification_date),
    });

    revalidateTag("notifications");
    return { updatedNotifications };
  } catch (error) {
    return {
      error:
        "Wystąpił błąd podczas aktualizowania powiadomień. Spróbuj ponowanie później!",
    };
  }
};
