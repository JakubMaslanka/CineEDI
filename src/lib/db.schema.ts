import {
  pgTable,
  serial,
  text,
  jsonb,
  timestamp,
  integer,
  pgEnum,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["user", "admin"]);
export const notificationStatusEnum = pgEnum("status", ["sent", "received"]);

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    password: text("password").notNull(),
    image: text("image"),
    role: userRoleEnum("role").default("user").notNull(),
  },
  (table) => ({
    idIdx: index("id_idx").on(table.id),
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const userGenres = pgTable("user_genres", {
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  genre_id: integer("genre_id").references(() => movieGenres.id),
});

// Movies Table
export const movies = pgTable("movies", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  image_url: text("image_url"),
  year: integer("year"),
  director: text("director"),
});

// Movie Genres Table
export const movieGenres = pgTable("movie_genres", {
  id: serial("id").primaryKey().notNull(),
  movie_id: integer("movie_id")
    .references(() => movies.id)
    .notNull(),
  genre: text("genre").notNull(),
});

// Movie Cast Table
export const movieCast = pgTable("movie_cast", {
  movie_id: integer("movie_id")
    .references(() => movies.id)
    .notNull(),
  actor_name: text("actor_name").notNull(),
  role: text("role").notNull(),
});

// Rentals Table
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  movie_id: integer("movie_id")
    .references(() => movies.id)
    .notNull(),
  rental_date: timestamp("rental_date").defaultNow(),
  return_date: timestamp("return_date").notNull(),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  status: notificationStatusEnum("status").default("sent").notNull(),
  notification_date: timestamp("notification_date").defaultNow(),
});

// Favorites Table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  movie_id: integer("movie_id")
    .references(() => movies.id)
    .notNull(),
  added_on: timestamp("added_on").defaultNow(),
});

// EDI Transactions Table
export const ediTransactions = pgTable("edi_transactions", {
  id: serial("id").primaryKey().notNull(),
  type: text("type").notNull(),
  content: jsonb("content").notNull(),
  content_xml: text("content_xml"),
  created_at: timestamp("created_at").defaultNow(),
});
