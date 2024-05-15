"use client";

import { useState, useTransition } from "react";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { MovieGenres } from "@/lib/db.schema";
import { saveGenrePreferencesAction } from "@/actions/movie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const WelcomeModal = ({
  firstTimeLoggedIn,
  genres,
}: {
  firstTimeLoggedIn: boolean;
  genres: MovieGenres[];
}) => {
  const [selectedGenreIds, setSelectedGenreId] = useState<number[]>([]);
  const [isSavePreferencesActionPending, startSavePreferencesTransition] =
    useTransition();

  const handleSavePreferences = () => {
    startSavePreferencesTransition(() => {
      saveGenrePreferencesAction(selectedGenreIds).then((result) => {
        if (result.error) {
          toast.error(result.error);
        }
        if (result.success) {
          toast.success(result.success);
        }
      });
    });
  };

  return (
    <Dialog modal open={firstTimeLoggedIn}>
      <DialogContent className="bg-neutral-900 border-neutral-800 shadow-2xl max-w-3xl outline-none max-h-[calc(100svh-50px)] overflow-hidden">
        <DialogTitle className="text-neutral-200 text-3xl">
          <p>Witamy na CineEDI!</p>
        </DialogTitle>
        <DialogDescription asChild>
          <p className="text-neutral-500">
            Niezmiernie nam miło za wybór naszej platformy jako dostawcy filmów
            VOD. Chcemy, aby twoje doświadczenia z użytkownika platformy były
            jaknajlepsze z tego powodu potrzebujemy infomacji o twoich
            ulubionych gatunkach filmowych. Na ich podstawie będziesz dostawał
            informacje o nowych interesujących Cię produkcjach, które zawitały
            na platformie!
          </p>
        </DialogDescription>
        <DialogTitle className="text-neutral-400 mt-4">
          Moje ulubione gatunki filmowe to:
        </DialogTitle>
        <div className="mt-4 pb-12 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-3 lg:grid-cols-3 xl:gap-x-4 overflow-y-scroll h-[300px]">
          {(genres ?? []).map(({ genre, id }) => (
            <div
              key={id}
              className={cn(
                "group relative shadow-lg border border-cineedi rounded-md flex justify-center items-center cursor-pointer select-none transition-colors duration-200 ease-in-out",
                selectedGenreIds.includes(id) && "bg-cineedi"
              )}
              onClick={() =>
                selectedGenreIds.includes(id)
                  ? setSelectedGenreId((prevSelectedGenreIds) =>
                      prevSelectedGenreIds.filter((genreId) => genreId !== id)
                    )
                  : setSelectedGenreId((prevSelectedGenreIds) => [
                      ...prevSelectedGenreIds,
                      id,
                    ])
              }
            >
              <h3 className="text-sm font-bold text-neutral-200 py-8">
                {genre}
              </h3>
            </div>
          ))}
        </div>
        <button
          disabled={
            selectedGenreIds.length === 0 || isSavePreferencesActionPending
          }
          onClick={handleSavePreferences}
          className="flex mt-4 w-full items-center justify-center rounded-md border border-transparent bg-cineedi px-8 py-3 text-base font-medium text-white hover:bg-cineedi/75 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cineedi focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-cineedi disabled:opacity-25"
        >
          {isSavePreferencesActionPending ? (
            <LoaderCircleIcon
              className="mr-2 h-6 w-6 flex-shrink-0 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <SaveIcon
              className="mr-2 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
          )}
          <span>Zapisz moje preferencje</span>
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
