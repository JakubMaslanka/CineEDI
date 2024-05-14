import { db } from "@/lib/db";
import { notFound } from "next/navigation";

const MoviePage = async ({ params: { id } }: { params: { id: string } }) => {
  const movie = await db.query.moviesToGenres.findFirst({
    with: { movieGenre: true, movie: true },
    where: (schema, { eq }) => eq(schema.movieId, +id),
  });

  if (!movie) {
    notFound();
  }

  return <h1>{JSON.stringify(movie)}</h1>;
};

export default MoviePage;
