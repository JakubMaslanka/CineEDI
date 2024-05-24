import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { MovieLayout } from "@/components/movie/movie-layout";

const MoviePage = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await auth();

  if (!session) redirect("/auth/sign-in");

  const movie = await db.query.moviesToGenres.findMany({
    with: { movieGenre: true, movie: true },
    where: (schema, { eq }) => eq(schema.movieId, +id),
  });

  if (!movie) notFound();

  const isFavourite = await db.query.favorites.findFirst({
    where: (schema, { and, eq }) =>
      and(eq(schema.movie_id, +id), eq(schema.user_id, session.user.id)),
  });

  const isRented = await db.query.rentals
    .findMany({
      where: (schema, { and, eq }) =>
        and(eq(schema.movie_id, +id), eq(schema.user_id, session.user.id)),
      orderBy: (schema, { desc }) => desc(schema.rental_date),
    })
    .then((data) => data?.[0] ?? false);

  return (
    <MovieLayout
      movie={movie[0].movie}
      genres={movie.map(({ movieGenre }) => movieGenre.genre)}
      isFavourite={!!isFavourite}
      isRented={!!isRented && isRented.status === "rented"}
    />
  );
};

export default MoviePage;
