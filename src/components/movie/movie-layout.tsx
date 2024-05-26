"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";
import {
  Cross1Icon,
  PlayIcon,
  PlusIcon,
  RocketIcon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Movie, MovieGenres } from "@/lib/db.schema";
import {
  addToFavouriteAction,
  removeFromFavouriteAction,
  rentMovieAction,
} from "@/actions/movie";

export const MovieLayout = ({
  movie,
  genres,
  isRented,
  isFavourite,
}: {
  movie: Movie;
  genres: MovieGenres["genre"][];
  isRented: boolean;
  isFavourite: boolean;
}) => {
  const router = useRouter();
  const [isRentMovieActionPending, startRentMovieTransition] = useTransition();
  const [isAddToFavouriteActionPending, startAddToFavouriteTransition] =
    useTransition();
  const [
    isRemoveFromFavouriteActionPending,
    startRemoveFromFavouriteTransition,
  ] = useTransition();

  const handleMoviePlay = () => {
    router.push(`/player/${movie.id}`);
  };

  const handleAddToFavourite = () => {
    startAddToFavouriteTransition(() =>
      addToFavouriteAction(movie.id).then((result) => {
        if (result.error) {
          toast.error(result.error);
        }
        if (result.success) {
          toast.success(result.success);
        }
      })
    );
  };

  const handleRemoveFromFavourite = () => {
    startRemoveFromFavouriteTransition(() =>
      removeFromFavouriteAction(movie.id).then((result) => {
        if (result.error) {
          toast.error(result.error);
        }
        if (result.success) {
          toast.success(result.success);
        }
      })
    );
  };

  const handleRent = () => {
    startRentMovieTransition(() =>
      rentMovieAction(movie.id).then((result) => {
        if (result.error) {
          toast.error(result.error);
        }
        if (result.success) {
          toast.success(result.success.message);
          router.refresh();
          router.push(`/rent-status/${result.success.rentId}`);
        }
      })
    );
  };

  const breadcrumbs = [
    { id: 1, name: "Home", href: "/home" },
    { id: 2, name: movie.title, href: "" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 mb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      <div className="lg:max-w-lg lg:self-end">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center text-sm">
                  <Link
                    href={breadcrumb.href}
                    className="font-medium text-neutral-400 hover:text-neutral-500"
                  >
                    {breadcrumb.name}
                  </Link>
                  {breadcrumbIdx !== breadcrumbs.length - 1 ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 flex-shrink-0 text-neutral-700"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
            {movie.title}
          </h1>
        </div>

        <section aria-labelledby="information-heading" className="mt-4">
          <h2 id="information-heading" className="sr-only">
            Informacje o filmie
          </h2>

          <div className="flex items-center">
            <div className="flex items-center">
              <div>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) =>
                    Math.round(+movie.imdb_rating!) > rating ? (
                      <StarFilledIcon
                        key={rating}
                        className={"text-yellow-400 h-5 w-5 flex-shrink-0"}
                        aria-hidden="true"
                      />
                    ) : (
                      <StarIcon
                        key={rating}
                        className={"h-5 w-5 flex-shrink-0 text-gray-300 "}
                        aria-hidden="true"
                      />
                    )
                  )}
                </div>
                <p className="sr-only">{movie.imdb_rating} out of 10 stars</p>
              </div>
              <p className="ml-2 text-sm text-gray-500">
                {movie.imdb_rating} / 10
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-base text-neutral-300">
              Gatunki: {genres.join(", ")}
            </p>
          </div>
          <div className="mt-2.5 border-b border-neutral-500 pb-6">
            <p className="text-base text-neutral-300">
              Reżyser: {movie.director}
            </p>
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-xs text-neutral-600">Opis filmu:</p>
            <p className="text-base text-neutral-300">{movie.description}</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-neutral-600">Krótki opis fabuły:</p>
            <p className="text-base text-neutral-300">{movie.storyline}</p>
          </div>
        </section>
      </div>

      <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
          <img
            src={movie.image_url!}
            alt={`${movie.title} poster`}
            className="h-full w-full object-fill object-center"
          />
        </div>
      </div>

      <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        <section aria-labelledby="options-heading">
          <h2 id="options-heading" className="sr-only">
            Opcje filmu
          </h2>

          <div className="mt-10">
            <button
              disabled={isRentMovieActionPending}
              onClick={isRented ? handleMoviePlay : handleRent}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-cineedi px-8 py-3 text-base font-medium text-white hover:bg-cineedi/75 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cineedi focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-cineedi disabled:opacity-25"
            >
              {isRented ? (
                <>
                  <PlayIcon
                    className="mr-2 h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>Odtwarzaj</span>
                </>
              ) : (
                <>
                  {isRentMovieActionPending ? (
                    <LoaderCircleIcon
                      className="mr-2 h-6 w-6 flex-shrink-0 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <RocketIcon
                      className="mr-2 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>Wypożycz</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={
                isFavourite ? handleRemoveFromFavourite : handleAddToFavourite
              }
              disabled={
                isAddToFavouriteActionPending ||
                isRemoveFromFavouriteActionPending
              }
              className="flex w-full items-center border border-neutral-400 justify-center rounded-md bg-transparent px-8 py-3 text-base font-medium text-neutral-400 hover:text-neutral-200 hover:border-neutral-200 transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-transparent disabled:opacity-25"
            >
              {isFavourite ? (
                <>
                  {isRemoveFromFavouriteActionPending ? (
                    <LoaderCircleIcon
                      className="mr-2 h-6 w-6 flex-shrink-0 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Cross1Icon
                      className="mr-2 h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}

                  <span>Usuń z mojej listy</span>
                </>
              ) : (
                <>
                  {isAddToFavouriteActionPending ? (
                    <LoaderCircleIcon
                      className="mr-2 h-6 w-6 flex-shrink-0 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <PlusIcon
                      className="mr-2 h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}

                  <span>Dodaj do mojej listy</span>
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
