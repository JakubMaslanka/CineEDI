import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MoviesGrid } from "@/components/home/movies-grid";

const MyListPage = async () => {
  const session = await auth();

  if (!session) redirect("/auth/sign-in");

  const movieIds = await db.query.favorites.findMany({
    where: (schema, { eq }) => eq(schema.user_id, session.user.id),
    orderBy: (schema) => schema.added_on,
    columns: {
      movie_id: true,
    },
  });

  if (movieIds.length === 0) {
    return (
      <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <main className="flex-1">
          <div className="flex items-baseline justify-between border-b border-neutral-400 pb-6 pt-4">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-200">
              Twoja lista filmów:
            </h1>
          </div>

          <div className="lg:col-span-3">
            <div className="mt-12 text-center">
              <p className="text-base text-neutral-300">
                Brak filmów na twojej liście!
              </p>
              <p className="text-base text-neutral-400">
                Zapoznaj się z zasobami wypożyczalni i dodaj pozycje, które
                wpadły Ci w oko. 😉
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const movies = await db.query.movies.findMany({
    where: (schema, { inArray }) =>
      inArray(
        schema.id,
        (movieIds ?? []).map(({ movie_id }) => movie_id)
      ),
  });

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <main className="flex-1">
        <div className="flex items-baseline justify-between border-b border-neutral-400 pb-6 pt-4">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-200">
            Twoja lista filmów:
          </h1>
        </div>

        <div className="lg:col-span-3">
          <MoviesGrid movies={movies} className="lg:grid-cols-4" />
        </div>
      </main>
    </div>
  );
};

export default MyListPage;
