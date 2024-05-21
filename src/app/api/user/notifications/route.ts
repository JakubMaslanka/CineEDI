import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimitByUserIP } from "@/lib/rateLimiter";
import { NextResponse } from "next/server";

export async function GET() {
  let limitExceeded = false;
  await rateLimitByUserIP(50, 1000 * 60 /* 1 min */).catch(() => {
    limitExceeded = true;
  });

  if (limitExceeded) {
    return { error: "Osiągnięto limit żądań! Spróbuj ponowanie później." };
  }

  try {
    const session = await auth();

    if (!session || !session.user.id) {
      return { error: "Nie jesteś zalogowany!" };
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
