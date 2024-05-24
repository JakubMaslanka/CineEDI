import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Notifications } from "@/lib/db.schema";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { NextResponse } from "next/server";

type ResponseType = Promise<
  | NextResponse<{
      notifications: Notifications[];
    }>
  | NextResponse<{ error: string }>
>;

export async function GET(): ResponseType {
  let limitExceeded = false;
  await rateLimitByUserIP(50, 1000 * 60 /* 1 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return NextResponse.json({
      error: "Osiągnięto limit żądań! Spróbuj ponowanie później.",
    });
  }

  try {
    const session = await auth();

    if (!session || !session.user.id) {
      return NextResponse.json({
        error: "Nie jesteś zalogowany!",
      });
    }

    const userId = session.user.id;

    const notifications = await db.query.notifications.findMany({
      where: (schema, { eq }) => eq(schema.user_id, userId),
      orderBy: (schema, { desc }) => desc(schema.notification_date),
    });

    return NextResponse.json({
      notifications,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Wystąpił błąd podczas pobierania powiadomień!",
    });
  }
}
