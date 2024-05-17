ALTER TABLE "cast_to_movies" DROP CONSTRAINT "cast_to_movies_cast_id_cast_id_fk";
--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_movie_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "create_at" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cast_to_movies" ADD CONSTRAINT "cast_to_movies_cast_id_cast_id_fk" FOREIGN KEY ("cast_id") REFERENCES "public"."cast"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
