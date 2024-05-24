"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  type MovieInsert,
  movies,
  movieGenres,
  moviesToGenres,
} from "@/lib/db.schema";
import { notifyUsersAboutNewMovie } from "@/actions/notifications";

import { movieValidationSchema } from "./validation";

export const getMovie = async (id: number) => {
  return await db.query.moviesToGenres
    .findMany({
      where: (schema, { eq }) => eq(schema.movieId, id),
      with: {
        movie: true,
        movieGenre: true,
      },
    })
    .then((data) => {
      const movie = data[0].movie;
      const genres = data.map((entry) => entry.movieGenre.id);

      return { ...movie, genres };
    });
};

export const getMovies = async () => {
  return await db.select().from(movies).orderBy(asc(movies.create_at));
};

export const getAllGeneres = async () => {
  return await db.select().from(movieGenres).orderBy(asc(movieGenres.genre));
};

export const insertMovie = async (
  newMovie: z.infer<typeof movieValidationSchema>
) => {
  const session = await auth();
  const validatedFields = movieValidationSchema.safeParse(newMovie);

  if (!validatedFields.success) {
    throw Error("Film nie spełnia wymaganych kryteriów!");
  }

  if (!session) {
    throw Error("Nie jesteś zalogowany!");
  }

  try {
    const {
      title,
      genres,
      director,
      image_url,
      imdb_rating,
      year,
      description,
      storyline,
    } = validatedFields.data;

    const newMovie = await db
      .insert(movies)
      .values({
        title,
        image_url,
        director,
        year,
        imdb_rating: imdb_rating.toLocaleString(),
        description,
        storyline,
      })
      .returning();
    await db.insert(moviesToGenres).values(
      genres.map((movieGenresId) => ({
        movieId: newMovie[0].id,
        movieGenresId,
      }))
    );

    await notifyUsersAboutNewMovie(newMovie[0].title, genres);
    revalidatePath("/admin-panel/movies");
    return newMovie[0];
  } catch (error) {
    console.error(
      `[${new Date().toDateString()}] Insert Movie -> server actions -> Error occured: ${error}`
    );
    throw new Error("Something went wrong while adding new movie");
  }
};

export const updateMovie = async (
  movieId: number,
  updatedMovie: z.infer<typeof movieValidationSchema>,
  isGenresEqual: boolean
) => {
  const session = await auth();
  const validatedFields = movieValidationSchema.safeParse(updatedMovie);

  if (!movieId) throw new Error("Invalid movie id");

  if (!validatedFields.success)
    throw Error("Film nie spełnia wymaganych kryteriów!");

  if (!session) throw Error("Nie jesteś zalogowany!");

  try {
    const {
      title,
      genres,
      director,
      image_url,
      imdb_rating,
      year,
      description,
      storyline,
    } = validatedFields.data;

    const movie = await db
      .update(movies)
      .set({
        title,
        image_url,
        director,
        year,
        imdb_rating: imdb_rating.toLocaleString(),
        description,
        storyline,
      })
      .where(eq(movies.id, movieId))
      .returning();

    if (!isGenresEqual) {
      await db
        .delete(moviesToGenres)
        .where(eq(moviesToGenres.movieId, movieId));
      await db.insert(moviesToGenres).values(
        genres.map((movieGenresId) => ({
          movieId: movie[0].id,
          movieGenresId,
        }))
      );
    }

    revalidatePath("/admin-panel/movies");
    return movie[0];
  } catch (error) {
    console.error(
      `[${new Date().toDateString()}] Update Movie -> server actions -> Error occured: ${error}`
    );
    throw new Error("Something went wrong while editing movie");
  }
};

export const deleteMovie = async ({ title, id }: MovieInsert) => {
  try {
    if (!id) throw new Error("Invalid movie id");
    const deletedGenre = await db
      .delete(movies)
      .where(eq(movies.id, id))
      .returning();
    revalidatePath("/admin-panel/movies");
    return deletedGenre[0];
  } catch (error) {
    console.error(
      `[${new Date().toDateString()}] Delete Movies -> server actions -> Error occured: ${error}`
    );
    throw new Error(`Something went wrong while deleting "${title}" movie`);
  }
};
