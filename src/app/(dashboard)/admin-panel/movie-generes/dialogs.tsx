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
import { MovieGenres } from "@/lib/db.schema";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { getGenere } from "./actions";
import { DeleteGenereForm, InsertGenereForm, UpdateGenereForm } from "./forms";

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
  const [dialogOptions, setDialogOptions] = useState<
    DialogOptions | undefined
  >();

  const openDialog = (options: DialogOptions) => {
    setDialogOptions(options);
  };

  const closeDialog = () => {
    setDialogOptions(undefined);
  };

  return (
    <DialogContext.Provider value={{ dialogOptions, openDialog, closeDialog }}>
      <DialogComponent />
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

const DialogComponent = () => {
  const { dialogOptions, closeDialog } = useDialog();
  const [record, setRecord] = useState<MovieGenres>();

  const getRecord = useCallback(async (id: number) => {
    await getGenere(id)
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
      insert: "Dodaj nowy gatunek",
      update: "Zaktualizuj istniejący gatunek",
      delete: "Usuń istniejący gatunek",
    };

    return titles[mode];
  };

  const getDialogContentByMode = (mode: DialogOptions["mode"]) => {
    const content: Record<DialogOptions["mode"], ReactNode> = {
      insert: <InsertGenereForm />,
      update: (
        <UpdateGenereForm existingGenere={record} onClose={closeDialog} />
      ),
      delete: (
        <DeleteGenereForm existingGenere={record} onClose={closeDialog} />
      ),
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
