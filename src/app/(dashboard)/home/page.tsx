import { unstable_noStore as noStore } from "next/cache";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { asc, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Movie, movies as moviesSchema } from "@/lib/db.schema";
import { MoviesWithFilterLayout } from "@/components/home/movies-with-filter-layout";

export const revalidate = 1800;

interface SearchParams {
  sortBy?: "rating" | "year" | "title_asc" | "title_desc";
  search_query?: string;
  genresFiltering?: string;
  directorsFiltering?: string;
  ratingFiltering?: string;
}

const WelcomeModal = dynamic(() => import("@/components/home/welcome-modal"), {
  ssr: false,
});

async function fetchMoviesBySearchParams(
  searchParams: SearchParams
): Promise<Movie[]> {
  let movies: Movie[] = await db.query.movies.findMany();

  if (
    searchParams.sortBy &&
    ["rating", "year", "title_asc", "title_desc"].includes(searchParams.sortBy)
  ) {
    const sortKeyMap = {
      rating: desc(moviesSchema.imdb_rating),
      year: desc(moviesSchema.year),
      title_asc: asc(moviesSchema.title),
      title_desc: desc(moviesSchema.title),
    };

    movies = await db.query.movies.findMany({
      orderBy: sortKeyMap[searchParams.sortBy],
    });
  }

  if (searchParams.search_query) {
    movies = await db.query.movies.findMany({
      where: (moviesSchema, { ilike }) =>
        ilike(moviesSchema.title, `%${searchParams.search_query}%`),
    });
  }

  if (searchParams.genresFiltering) {
    const genreIds = searchParams.genresFiltering
      .split(",")
      .map((id) => parseInt(id.trim()));
    const genreFilteredMovies = await db.query.moviesToGenres
      .findMany({
        with: { movieGenre: true, movie: true },
      })
      .then((data) =>
        data.filter(({ movieGenre }) => genreIds.includes(movieGenre.id))
      );

    const filteredMovieIds = new Set(
      genreFilteredMovies.map(({ movie }) => movie.id)
    );
    movies = movies.filter((movie) => filteredMovieIds.has(movie.id));
  }

  if (searchParams.directorsFiltering) {
    const directorIds = searchParams.directorsFiltering
      .split(",")
      .map((id) => id.trim());
    movies = movies.filter((movie) => directorIds.includes(movie.director!));
  }

  if (searchParams.ratingFiltering) {
    movies = movies.filter(
      ({ imdb_rating }) => +imdb_rating! >= +searchParams.ratingFiltering!
    );
  }

  return movies;
}

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = await auth();

  if (!session) redirect("/auth/sign-in");

  const genres = await db.query.movieGenres.findMany();
  const directors = await db.query.movies.findMany({
    columns: { director: true },
  });
  const movies = await fetchMoviesBySearchParams(searchParams);
  const user = await db.query.users.findFirst({
    where: (schema, { eq }) => eq(schema.id, session.user.id),
    columns: {
      firstTimeLoggedIn: true,
    },
  });

  return (
    <>
      <WelcomeModal
        firstTimeLoggedIn={user?.firstTimeLoggedIn ?? false}
        genres={genres}
      />
      <MoviesWithFilterLayout
        movies={movies}
        genres={genres}
        directors={directors}
      />
    </>
  );
};

export default HomePage;
