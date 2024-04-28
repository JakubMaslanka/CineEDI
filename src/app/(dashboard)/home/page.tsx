import { unstable_noStore as noStore } from "next/cache";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { movies as moviesSchema } from "@/lib/db.schema";

const HomePage = async () => {
  const session = await auth();
  noStore();
  const movies = await db
    .select()
    .from(moviesSchema)
    .orderBy(asc(moviesSchema.year));

  return (
    <div className="flex flex-col flex-wrap">
      <h1>Session:</h1>
      {JSON.stringify(session)}
      <h1>Ostatnio dodane:</h1>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {(movies ?? []).map((movie) => (
          <div key={movie.id}>
            <div className="relative">
              <div className="relative h-72 w-full overflow-hidden rounded-lg">
                <img
                  src={movie.image_url ?? ""}
                  alt={`${movie.title} poster`}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="relative mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {movie.director}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{movie.year}</p>
              </div>
              <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                />
                <p className="relative text-lg font-semibold text-white">
                  {movie.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
