import { redirect } from "next/navigation";
import { sub } from "date-fns/sub";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MoviesGrid } from "@/components/home/movies-grid";

const RecentlyAddedMoviesPage = async () => {
  const session = await auth();

  if (!session) redirect("/auth/sign-in");

  const movies = await db.query.movies.findMany({
    where: (schema, { gte }) =>
      gte(schema.create_at, sub(new Date(), { weeks: 2 })),
    orderBy: (schema, { desc }) => desc(schema.create_at),
  });

  if (movies.length === 0) {
    return (
      <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <main className="flex-1">
          <div className="flex items-baseline justify-between border-b border-neutral-400 pb-6 pt-4">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-200">
              Ostatnio dodane filmy:
            </h1>
          </div>

          <div className="lg:col-span-3">
            <div className="mt-12 text-center">
              <p className="text-base text-neutral-300">
                Ops! Wygaląda na to, że na przestrzeni ostatnich 2 tygodni nie
                pojawiły się żadne nowe produkcję.
              </p>
              <p className="text-base text-neutral-400">Pracujemy nad tym! 🫡</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <main className="flex-1">
        <div className="flex items-baseline justify-between border-b border-neutral-400 pb-6 pt-4">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-200">
            Ostatnio dodane filmy:
          </h1>
        </div>

        <div className="lg:col-span-3">
          <MoviesGrid movies={movies} className="lg:grid-cols-4" />
        </div>
      </main>
    </div>
  );
};

export default RecentlyAddedMoviesPage;
