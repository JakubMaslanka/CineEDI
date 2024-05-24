"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Movie, MovieGenres } from "@/lib/db.schema";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { getAllGeneres, getMovie } from "./actions";
import { InsertMovieForm, UpdateMovieForm, DeleteMovieForm } from "./forms";

interface DialogOptions {
  mode: "insert" | "update" | "delete";
  id?: number;
}

interface DialogContextType {
  dialogOptions: DialogOptions | undefined;
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movieGeneres, setMovieGeneres] = useState<MovieGenres[]>();
  const [dialogOptions, setDialogOptions] = useState<
    DialogOptions | undefined
  >();

  const openDialog = (options: DialogOptions) => {
    setDialogOptions(options);
  };

  const closeDialog = () => {
    setDialogOptions(undefined);
  };

  const getMovieGeneres = useCallback(async () => {
    getAllGeneres()
      .then((movieGeneres) => setMovieGeneres(movieGeneres))
      .catch(() =>
        toast.error("Coś poszło nie tak przy próbie pobrania gatunków!")
      );
  }, []);

  useEffect(() => {
    getMovieGeneres();
  }, [getMovieGeneres]);

  return (
    <DialogContext.Provider value={{ dialogOptions, openDialog, closeDialog }}>
      <DialogComponent movieGeneres={movieGeneres} />
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
};

const DialogComponent = ({
  movieGeneres,
}: {
  movieGeneres: MovieGenres[] | undefined;
}) => {
  const { dialogOptions, closeDialog } = useDialog();
  const [record, setRecord] = useState<Movie & { genres: number[] }>();

  const getRecord = useCallback(async (id: number) => {
    getMovie(id)
      .then((record) => setRecord(record))
      .catch(() =>
        toast.error("Coś poszło nie tak przy próbie pobrania recordu!")
      );
  }, []);

  useEffect(() => {
    if (!dialogOptions?.id) return;

    getRecord(dialogOptions?.id);
  }, [dialogOptions?.id, getRecord]);

  const getDialogTitleByMode = (mode: DialogOptions["mode"]) => {
    const titles: Record<DialogOptions["mode"], string> = {
      insert: "Dodaj nowy film",
      update: "Zaktualizuj istniejący film",
      delete: "Usuń istniejący film",
    };

    return titles[mode];
  };

  const getDialogContentByMode = (mode: DialogOptions["mode"]) => {
    const content: Record<DialogOptions["mode"], ReactNode> = {
      insert: (
        <InsertMovieForm movieGeneres={movieGeneres} onClose={closeDialog} />
      ),
      update: (
        <UpdateMovieForm
          movieGeneres={movieGeneres}
          existingMovie={record}
          onClose={closeDialog}
        />
      ),
      delete: <DeleteMovieForm existingMovie={record} onClose={closeDialog} />,
    };

    return content[mode];
  };

  if (!dialogOptions?.mode) {
    return null;
  }

  return (
    <Dialog open={!!dialogOptions.mode}>
      <DialogContent>
        <DialogTitle>
          <div className="flex justify-between">
            {getDialogTitleByMode(dialogOptions.mode)}
            <div className="cursor-pointer">
              <Cross2Icon
                className="h-4 w-4"
                onClick={() => {
                  setRecord(undefined);
                  closeDialog();
                }}
              />
              <span className="sr-only">Zamknij okno</span>
            </div>
          </div>
        </DialogTitle>
        {getDialogContentByMode(dialogOptions.mode)}
      </DialogContent>
    </Dialog>
  );
};
