import { Poppins } from "next/font/google";
import { cn } from "@/utils/cn";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Movie } from "@/lib/db.schema";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export const MoviesGrid = ({ movies }: { movies: Movie[] }) => (
  <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
    {movies.length > 0 ? (
      (movies ?? []).map((movie) => (
        <div key={movie.id}>
          <MovieCard movie={movie} />
        </div>
      ))
    ) : (
      <p>Nie znaleziono filmów</p>
    )}
  </div>
);

const MovieCard = ({ movie }: { movie: Movie }) => (
  <div className="relative">
    <div className="relative h-72 w-full overflow-hidden rounded-lg cursor-pointer">
      <img
        src={movie.image_url ?? ""}
        alt={`${movie.title} poster`}
        className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-200 ease-in-out"
      />
    </div>
    <div className="relative mt-4">
      <h3
        className={cn(
          "text-sm font-medium text-neutral-200",
          poppins.className
        )}
      >
        {movie.director}
      </h3>
      <div className="flex justify-between items-center -mt-0.5">
        <p className=" text-sm text-neutral-400">{movie.year}</p>
        <p className="inline-flex gap-1 items-center text-sm text-neutral-400">
          {movie.imdb_rating} / 10
          <StarFilledIcon className="text-amber-400" />
        </p>
      </div>
    </div>
    <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden pointer-events-none rounded-lg p-4">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
      />
      <p className="relative text-lg font-semibold text-white">{movie.title}</p>
    </div>
  </div>
);
