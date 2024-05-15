DO $$ BEGIN
 CREATE TYPE "public"."rental_status" AS ENUM('rented', 'ended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "rentals" RENAME COLUMN "return_date" TO "rental_end_date";--> statement-breakpoint
ALTER TABLE "movies_to_genres" DROP CONSTRAINT "movies_to_genres_movie_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_genres" DROP CONSTRAINT "users_to_genres_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rentals" ADD COLUMN "edi_transaction_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rentals" ADD COLUMN "rental_status" "rental_status" DEFAULT 'rented' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movies_to_genres" ADD CONSTRAINT "movies_to_genres_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentals" ADD CONSTRAINT "rentals_edi_transaction_id_edi_transactions_id_fk" FOREIGN KEY ("edi_transaction_id") REFERENCES "public"."edi_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_genres" ADD CONSTRAINT "users_to_genres_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "edi_transactions" DROP COLUMN IF EXISTS "type";