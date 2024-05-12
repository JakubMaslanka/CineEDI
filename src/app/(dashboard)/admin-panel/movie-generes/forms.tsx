"use client";

import { useEffect, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SymbolIcon } from "@radix-ui/react-icons";
import { MovieGenres, MovieGenresInsert } from "@/lib/db.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteGenere, insertGenere, updateGenere } from "./actions";

const genereSchema = z.object({
  genre: z
    .string({ required_error: "Nazwa gatunku jest wymagana!" })
    .min(1, { message: "Nazwa gatunku jest wymagana!" }),
});

export const InsertGenereForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<MovieGenresInsert>({
    resolver: zodResolver(genereSchema),
  });

  const onSubmit = (data: MovieGenresInsert) => {
    startTransition(() =>
      insertGenere(data)
        .then((result) => {
          toast.success(
            `Gatunek "${result.genre}" został pomyślnie stworzony.`
          );
        })
        .catch(() => {
          toast.error("Coś poszło nie tak podczas dodawania gatunku.");
        })
    );
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa gatunku</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="text"
                    placeholder="Komedia"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="default"
          disabled={isPending || !form.formState.isValid}
          size="sm"
        >
          Dodaj gatunek
        </Button>
      </form>
    </Form>
  );
};

export const UpdateGenereForm = ({
  existingGenere,
  onClose,
}: {
  existingGenere?: MovieGenres;
  onClose: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<MovieGenresInsert>({
    resolver: zodResolver(genereSchema),
  });

  const onSubmit = (data: MovieGenresInsert) => {
    startTransition(() => {
      updateGenere({ genre: data.genre, id: existingGenere!.id })
        .then((result) => {
          toast.success(
            `Gatunek "${result.genre}" został pomyślnie zaktualizowany.`
          );
          onClose();
        })
        .catch(() => {
          toast.error("Coś poszło nie tak podczas edytowania gatunku.");
        });
    });
  };

  useEffect(() => {
    if (existingGenere) {
      form.reset({
        genre: existingGenere.genre,
        id: existingGenere.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingGenere]);

  if (!existingGenere?.id || !existingGenere.genre) {
    return (
      <div className="flex justify-start items-center gap-2.5">
        <SymbolIcon className="h-5 w-5 animate-spin text-neutral-700" />
        <p>Pobieram dodatkowe informacje o zasobie...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa gatunku</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="text"
                    placeholder="Komedia"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="default"
          disabled={
            isPending ||
            !form.formState.isValid ||
            existingGenere?.genre === form.getValues("genre")
          }
          size="sm"
        >
          Edytuj gatunek
        </Button>
      </form>
    </Form>
  );
};

export const DeleteGenereForm = ({
  existingGenere,
  onClose,
}: {
  existingGenere?: MovieGenres;
  onClose: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteGenere(existingGenere!)
        .then((result) => {
          toast.success(`Gatunek "${result.genre}" został pomyślnie usunięty.`);
          onClose();
        })
        .catch(() => {
          toast.error("Coś poszło nie tak podczas usuwania gatunku.");
        });
    });
  };

  if (!existingGenere?.id || !existingGenere.genre) {
    return (
      <div className="flex justify-center items-center">
        <SymbolIcon className="h-5 w-5 animate-spin text-neutral-300" />
        <p>Pobieram dodatkowe informacje o zasobie...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <p>
        Czy jesteś pewien, że chcesz usunąć gatunek o nazwie &ldquo;
        {existingGenere.genre}&rdquo;?
      </p>
      <p className="text-destructive text-sm pb-8">
        Ta operacja jest nieodwracalna!
      </p>
      <Button
        onClick={handleDelete}
        variant="destructive"
        disabled={isPending}
        size="sm"
      >
        Usuń gatunek
      </Button>
    </div>
  );
};
