import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1),
    AUTH_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
  },
  client: {
    PUBLIC_NEXT_AUTH_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  clientPrefix: "PUBLIC_NEXT_",
});
