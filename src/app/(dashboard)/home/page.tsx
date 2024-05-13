import { unstable_noStore as noStore } from "next/cache";
import { asc, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { Movie, movies as moviesSchema, movieGenres } from "@/lib/db.schema";
import { MoviesWithFilterLayout } from "@/components/home/movies-with-filter-layout";

export const revalidate = 1800;

const HomePage = async ({
  searchParams,
}: {
  searchParams: { sortBy?: string };
}) => {
  let movies: Movie[] = [];
  console.log(searchParams);
  const genres = await db.query.movieGenres.findMany();
  const directors = await db.query.movies.findMany({
    columns: { director: true },
  });
  movies = await db.select().from(moviesSchema);

  if (
    searchParams?.sortBy &&
    ["rating", "year", "title_asc", "title_desc"].includes(searchParams?.sortBy)
  ) {
    const sortKeyMap = {
      rating: desc(moviesSchema.imdb_rating),
      year: desc(moviesSchema.year),
      title_asc: asc(moviesSchema.title),
      title_desc: desc(moviesSchema.title),
    };

    movies = await db
      .select()
      .from(moviesSchema)
      .orderBy(sortKeyMap[searchParams?.sortBy as keyof typeof sortKeyMap]);
  }

  return (
    <MoviesWithFilterLayout
      movies={movies}
      genres={genres}
      directors={directors}
    />
  );
};

export default HomePage;
