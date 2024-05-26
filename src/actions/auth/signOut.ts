"use server";

import { cookies } from "next/headers";
import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  "use server";

  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name);
    });

  await signOut({ redirectTo: "/" });
  redirect("/");
};
