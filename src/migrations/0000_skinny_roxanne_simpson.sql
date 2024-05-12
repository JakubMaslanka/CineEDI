DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('sent', 'received');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"userId" varchar NOT NULL,
	"type" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"providerAccountId" varchar NOT NULL,
	"refresh_token" varchar,
	"access_token" varchar,
	"expires_at" integer,
	"token_type" varchar,
	"scope" varchar,
	"id_token" varchar,
	"session_state" varchar,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cast" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_name" varchar NOT NULL,
	"role" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cast_to_movies" (
	"cast_id" integer NOT NULL,
	"movie_id" integer NOT NULL,
	CONSTRAINT "cast_to_movies_cast_id_movie_id_pk" PRIMARY KEY("cast_id","movie_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "edi_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"content" jsonb NOT NULL,
	"content_xml" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"movie_id" integer NOT NULL,
	"added_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"genre" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"storyline" varchar,
	"image_url" varchar,
	"year" integer,
	"imdb_rating" numeric,
	"director" varchar,
	"tags" text[] DEFAULT ARRAY[]::text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies_to_genres" (
	"movie_id" integer NOT NULL,
	"movie_genres_id" integer NOT NULL,
	CONSTRAINT "movies_to_genres_movie_id_movie_genres_id_pk" PRIMARY KEY("movie_id","movie_genres_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"message" varchar NOT NULL,
	"status" "status" DEFAULT 'sent' NOT NULL,
	"notification_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"token" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "password_reset_tokens_email_token_pk" PRIMARY KEY("email","token"),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"movie_id" integer NOT NULL,
	"rental_date" timestamp DEFAULT now(),
	"return_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar NOT NULL,
	"email_verified" timestamp,
	"password" varchar NOT NULL,
	"image" varchar,
	"role" "role" DEFAULT 'user' NOT NULL,
	"first_time_logged_in" boolean DEFAULT true,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_genres" (
	"user_id" varchar NOT NULL,
	"movie_genres_id" integer NOT NULL,
	CONSTRAINT "users_to_genres_user_id_movie_genres_id_pk" PRIMARY KEY("user_id","movie_genres_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"token" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_email_token_pk" PRIMARY KEY("email","token"),
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cast_to_movies" ADD CONSTRAINT "cast_to_movies_cast_id_cast_id_fk" FOREIGN KEY ("cast_id") REFERENCES "public"."cast"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cast_to_movies" ADD CONSTRAINT "cast_to_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movies_to_genres" ADD CONSTRAINT "movies_to_genres_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movies_to_genres" ADD CONSTRAINT "movies_to_genres_movie_genres_id_movie_genres_id_fk" FOREIGN KEY ("movie_genres_id") REFERENCES "public"."movie_genres"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentals" ADD CONSTRAINT "rentals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentals" ADD CONSTRAINT "rentals_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_genres" ADD CONSTRAINT "users_to_genres_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_genres" ADD CONSTRAINT "users_to_genres_movie_genres_id_movie_genres_id_fk" FOREIGN KEY ("movie_genres_id") REFERENCES "public"."movie_genres"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_idx" ON "users" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");