import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db.schema";

export async function getUserByEmail(email: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await db.select().from(users).where(eq(users.id, id)).limit(1);
  } catch {
    return null;
  }
}
