import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  pgEnum,
  primaryKey,
  index,
  uniqueIndex,
  text,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["user", "admin"]);
export const rentalStatusEnum = pgEnum("rental_status", ["rented", "ended"]);
export const notificationStatusEnum = pgEnum("status", ["sent", "received"]);

export const users = pgTable(
  "users",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name"),
    email: varchar("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    password: varchar("password").notNull(),
    image: varchar("image"),
    role: userRoleEnum("role").default("user").notNull(),
    firstTimeLoggedIn: boolean("first_time_logged_in").default(true),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    idIdx: index("id_idx").on(table.id),
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("providerAccountId").notNull(),
    refresh_token: varchar("refresh_token"),
    access_token: varchar("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: varchar("id_token"),
    session_state: varchar("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: varchar("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar("email").notNull(),
    token: varchar("token").notNull().unique(),
    created_at: timestamp("created_at").defaultNow(),
    expires_at: timestamp("expires_at").notNull(),
  },
  (verificationToken) => ({
    compoundKey: primaryKey({
      columns: [verificationToken.email, verificationToken.token],
    }),
  })
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: varchar("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar("email").notNull(),
    token: varchar("token").notNull().unique(),
    created_at: timestamp("created_at").defaultNow(),
    expires_at: timestamp("expires_at").notNull(),
  },
  (passwordResetToken) => ({
    compoundKey: primaryKey({
      columns: [passwordResetToken.email, passwordResetToken.token],
    }),
  })
);

// Movies Table
export const movies = pgTable("movies", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: varchar("description"),
  storyline: varchar("storyline"),
  image_url: varchar("image_url"),
  year: integer("year"),
  imdb_rating: numeric("imdb_rating"),
  director: varchar("director"),
  create_at: timestamp("create_at").defaultNow(),
  tags: text("tags")
    .array()
    .default(sql`ARRAY[]::text[]`),
});

export type Movie = InferSelectModel<typeof movies>;
export type MovieInsert = InferInsertModel<typeof movies>;

export const usersRelations = relations(users, ({ many }) => ({
  usersToGenres: many(usersToGenres),
}));

// Movie Genres Table
export const movieGenres = pgTable("movie_genres", {
  id: serial("id").primaryKey(),
  genre: varchar("genre", { length: 64 }).notNull(),
});

export type MovieGenres = InferSelectModel<typeof movieGenres>;
export type MovieGenresInsert = InferInsertModel<typeof movieGenres>;

export const movieGenresRelations = relations(movieGenres, ({ many }) => ({
  usersToGenres: many(usersToGenres),
  moviesToGenres: many(moviesToGenres),
}));

export const usersToGenres = pgTable(
  "users_to_genres",
  {
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    movieGenresId: integer("movie_genres_id")
      .notNull()
      .references(() => movieGenres.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.movieGenresId] }),
  })
);

export const usersToGenresRelations = relations(usersToGenres, ({ one }) => ({
  movieGenre: one(movieGenres, {
    fields: [usersToGenres.movieGenresId],
    references: [movieGenres.id],
  }),
  user: one(users, {
    fields: [usersToGenres.userId],
    references: [users.id],
  }),
}));

export const moviesToGenres = pgTable(
  "movies_to_genres",
  {
    movieId: integer("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    movieGenresId: integer("movie_genres_id")
      .notNull()
      .references(() => movieGenres.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.movieId, t.movieGenresId] }),
  })
);

export const moviesToGenresRelations = relations(moviesToGenres, ({ one }) => ({
  movieGenre: one(movieGenres, {
    fields: [moviesToGenres.movieGenresId],
    references: [movieGenres.id],
  }),
  movie: one(movies, {
    fields: [moviesToGenres.movieId],
    references: [movies.id],
  }),
}));

// Rentals Table
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey().notNull(),
  user_id: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),
  movie_id: integer("movie_id")
    .references(() => movies.id, { onDelete: "no action" })
    .notNull(),
  edi_transaction_id: integer("edi_transaction_id")
    .references(() => ediTransactions.id, { onDelete: "no action" })
    .notNull(),
  status: rentalStatusEnum("rental_status").default("rented").notNull(),
  rental_date: timestamp("rental_date").defaultNow(),
  rental_end_date: timestamp("rental_end_date").notNull(),
});

export type Rentals = InferSelectModel<typeof rentals>;
export type RentalsInsert = InferInsertModel<typeof rentals>;

export const rentalsRelations = relations(rentals, ({ one }) => ({
  user_id: one(users, {
    fields: [rentals.user_id],
    references: [users.id],
  }),
  movie_id: one(movies, {
    fields: [rentals.movie_id],
    references: [movies.id],
  }),
  edi_transaction_id: one(ediTransactions, {
    fields: [rentals.edi_transaction_id],
    references: [ediTransactions.id],
  }),
}));

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey().notNull(),
  user_id: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: varchar("message").notNull(),
  status: notificationStatusEnum("status").default("sent").notNull(),
  notification_date: timestamp("notification_date").defaultNow(),
});

export type Notifications = InferSelectModel<typeof notifications>;
export type NotificationsInsert = InferInsertModel<typeof notifications>;

// Favorites Table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey().notNull(),
  user_id: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  movie_id: integer("movie_id")
    .references(() => movies.id, { onDelete: "cascade" })
    .notNull(),
  added_on: timestamp("added_on").defaultNow(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user_id: one(users, {
    fields: [favorites.user_id],
    references: [users.id],
  }),
  movie_id: one(movies, {
    fields: [favorites.movie_id],
    references: [movies.id],
  }),
}));

export type Favorites = InferSelectModel<typeof favorites>;
export type FavoritesInsert = InferInsertModel<typeof favorites>;

// EDI Transactions Table
export const ediTransactions = pgTable("edi_transactions", {
  id: serial("id").primaryKey().notNull(),
  edi_string: varchar("edi_string").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export type EdiTransactions = InferSelectModel<typeof ediTransactions>;
export type EdiTransactionsInsert = InferInsertModel<typeof ediTransactions>;
