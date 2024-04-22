import {
  pgTable,
  serial,
  varchar,
  jsonb,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["user", "admin"]);
export const notificationStatusEnum = pgEnum("status", ["sent", "received"]);

// Users Table
export const Users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  username: varchar("username", { length: 25 }).unique().notNull(),
  email: varchar("email").unique().notNull(),
  password_hash: varchar("password_hash").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  interested_genres: jsonb("interested_genres"),
  created_at: timestamp("created_at").defaultNow(),
});

// UserGenres Table (Junction Table for Many-to-Many relationship)
export const UserGenres = pgTable("user_genres", {
  user_id: integer("user_id").references(() => Users.id),
  genre_id: integer("genre_id").references(() => MovieGenres.id),
});

// Movies Table
export const Movies = pgTable("movies", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: varchar("description"),
  image_url: varchar("image_url"),
  year: integer("year"),
  director: varchar("director"),
});

// Movie Genres Table
export const MovieGenres = pgTable("movie_genres", {
  id: serial("id").primaryKey().notNull(),
  movie_id: integer("movie_id")
    .references(() => Movies.id)
    .notNull(),
  genre: varchar("genre").notNull(),
});

// Movie Cast Table
export const MovieCast = pgTable("movie_cast", {
  movie_id: integer("movie_id")
    .references(() => Movies.id)
    .notNull(),
  actor_name: varchar("actor_name").notNull(),
  role: varchar("role").notNull(),
});

// Rentals Table
export const Rentals = pgTable("rentals", {
  id: serial("id").primaryKey().notNull(),
  user_id: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  movie_id: integer("movie_id")
    .references(() => Movies.id)
    .notNull(),
  rental_date: timestamp("rental_date").defaultNow(),
  return_date: timestamp("return_date").notNull(),
});

// Notifications Table
export const Notifications = pgTable("notifications", {
  id: serial("id").primaryKey().notNull(),
  user_id: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  message: varchar("message").notNull(),
  status: notificationStatusEnum("status").default("sent").notNull(),
  notification_date: timestamp("notification_date").defaultNow(),
});

// Favorites Table
export const Favorites = pgTable("favorites", {
  id: serial("id").primaryKey().notNull(),
  user_id: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  movie_id: integer("movie_id")
    .references(() => Movies.id)
    .notNull(),
  added_on: timestamp("added_on").defaultNow(),
});

// EDI Transactions Table
export const EDI_Transactions = pgTable("edi_transactions", {
  id: serial("id").primaryKey().notNull(),
  type: varchar("type").notNull(),
  content: jsonb("content").notNull(),
  content_xml: varchar("content_xml"),
  created_at: timestamp("created_at").defaultNow(),
});
