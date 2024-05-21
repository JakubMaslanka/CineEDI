import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "./db";
import { notifications as notificationsSchema } from "./db.schema";

export const insertNotificationSchema = z
  .object({
    recipientUserId: z.string().min(1),
    message: z.string().min(1),
  })
  .required();

type InsertNotification = z.infer<typeof insertNotificationSchema>;

export const sendInAppNotification = async (
  notification: InsertNotification
) => {
  const validatedFields = insertNotificationSchema.safeParse(notification);

  if (!validatedFields.success) {
    return { error: "Poświadczenia nie spełniają wymaganych kryteriów!" };
  }

  const { recipientUserId, message } = validatedFields.data;

  try {
    await db.insert(notificationsSchema).values({
      user_id: recipientUserId,
      message: message,
    });

    console.info(
      `[${new Date().toDateString()}] Notification for user with id ${recipientUserId} sent successfully!`
    );

    revalidateTag("notifications");
    return { success: "Pomyślnie wysłano powiadomienie" };
  } catch (error) {
    return { error: "Wystąpił błąd podczas wysyłania powiadomienia" };
  }
};
