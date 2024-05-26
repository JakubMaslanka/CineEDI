"use server";

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

export const clearAuthCookiesAction = async () => {
  noStore();

  cookies()
    .getAll()
    .forEach((cookie) => cookies().delete(cookie.name));
};
