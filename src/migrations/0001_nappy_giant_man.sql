DROP TABLE "sessions";--> statement-breakpoint
DROP TABLE "verificationTokens";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");