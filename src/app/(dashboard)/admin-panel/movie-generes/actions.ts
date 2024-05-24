"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { type MovieGenresInsert, movieGenres } from "@/lib/db.schema";

export const getGenere = async (id: number) => {
  return await db.query.movieGenres.findFirst({
    where: (genre, { eq }) => eq(genre.id, id),
  });
};

export const getAllGeneres = async () => {
  return await db.select().from(movieGenres).orderBy(asc(movieGenres.genre));
};

export const insertGenere = async ({ genre }: MovieGenresInsert) => {
  try {
    const newGenre = await db.insert(movieGenres).values({ genre }).returning();

    revalidatePath("/admin-panel/movie-generes");
    return newGenre[0];
  } catch (error) {
    console.error(
      `[${new Date().toDateString()}] Insert Movie generes -> server actions -> Error occured: ${error}`
    );
    throw new Error("Something went wrong while adding new genre");
  }
};

export const updateGenere = async ({ genre, id }: MovieGenresInsert) => {
  try {
    if (!id) throw new Error("Invalid genere id");

    const updatedGenre = await db
      .update(movieGenres)
      .set({ genre })
      .where(eq(movieGenres.id, id!))
      .returning();

    revalidatePath("/admin-panel/movie-generes");
    return updatedGenre[0];
  } catch (error) {
    console.error(
      `[${new Date().toDateString()}] Update Movie generes -> server actions -> Error occured: ${error}`
    );
    throw new Error(`Something went wrong while editing "${genre}" genre`);
  }
};

export const deleteGenere = async ({ genre, id }: MovieGenresInsert) => {
  try {
    if (!id) throw new Error("Invalid genere id");

    const deletedGenre = await db
      .delete(movieGenres)
      .where(eq(movieGenres.id, id))
      .returning();

    revalidatePath("/admin-panel/movie-generes");
    return deletedGenre[0];
  } catch (error) {
    console.error(
      `[${new Date().toDateString()}] Delete Movie generes -> server actions -> Error occured: ${error}`
    );
    throw new Error(`Something went wrong while deleting "${genre}" genre`);
  }
};
