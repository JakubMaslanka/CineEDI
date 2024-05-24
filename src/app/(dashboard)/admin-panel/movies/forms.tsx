"use client";

import { WheelEventHandler, useEffect, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SymbolIcon } from "@radix-ui/react-icons";
import { Movie, MovieGenres } from "@/lib/db.schema";
import { arraysEqual } from "@/utils/array";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { insertMovie, updateMovie, deleteMovie } from "./actions";
import { movieValidationSchema } from "./validation";

type MovieForm = z.infer<typeof movieValidationSchema>;

export const InsertMovieForm = ({
  movieGeneres,
  onClose,
}: {
  movieGeneres: MovieGenres[] | undefined;
  onClose: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<MovieForm>({
    resolver: zodResolver(movieValidationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: MovieForm) => {
    startTransition(() =>
      insertMovie(data)
        .then((result) => {
          toast.success(
            `Film "${result.title}" został pomyślnie dodany do wypożyczalni.`
          );
          onClose();
        })
        .catch(() => {
          toast.error(
            "Coś poszło nie tak podczas dodawania filmu do wypożyczalni."
          );
        })
    );
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 px-1 max-h-[calc(100svh_-_150px)] overflow-y-scroll"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tytuł filmu<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="text"
                    placeholder="Shrek 2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genres"
            render={({ field: { onChange, value, ...restProps } }) => (
              <FormItem>
                <FormLabel>
                  Gatunki<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    data={
                      movieGeneres?.map((genere) => ({
                        label: genere.genre,
                        value: genere.id,
                      })) ?? []
                    }
                    inputProps={{
                      ...restProps,
                      placeholder: "Wybierz gatunki...",
                    }}
                    selectedIds={value}
                    onSelectedChanged={(newValue: number[]) =>
                      onChange(newValue)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  URL do miniaturki<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Reżyser<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="text"
                    placeholder="Andrew Adamson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Rok produkcji<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onWheelCapture={(e) => e.currentTarget.blur()}
                    type="number"
                    placeholder="2004"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imdb_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Rok produkcji<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onWheelCapture={(e) => e.currentTarget.blur()}
                    type="number"
                    placeholder="7.3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis filmu</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    rows={4}
                    className="flex h-18 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storyline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis fabuły</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    rows={4}
                    className="flex h-18 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          Dodaj film
        </Button>
      </form>
    </Form>
  );
};

export const UpdateMovieForm = ({
  movieGeneres,
  existingMovie,
  onClose,
}: {
  movieGeneres: MovieGenres[] | undefined;
  existingMovie?: Movie & { genres: number[] };
  onClose: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<MovieForm>({
    resolver: zodResolver(movieValidationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: MovieForm) => {
    startTransition(() => {
      const isGenresEqual = arraysEqual<number>(
        existingMovie!.genres,
        form.getValues("genres")
      );

      updateMovie(existingMovie!.id, data, isGenresEqual)
        .then((result) => {
          toast.success(
            `Film "${result.title}" został pomyślnie zaktualizowany.`
          );
          onClose();
        })
        .catch(() => {
          toast.error("Coś poszło nie tak podczas edytowania filmu.");
        });
    });
  };

  useEffect(() => {
    if (existingMovie) {
      form.reset({
        title: existingMovie.title,
        genres: existingMovie.genres,
        image_url: existingMovie.image_url!,
        director: existingMovie.director!,
        year: existingMovie.year!,
        imdb_rating: +existingMovie.imdb_rating!,
        description: existingMovie.description ?? undefined,
        storyline: existingMovie.storyline ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingMovie]);

  if (!existingMovie?.id || !existingMovie.title) {
    return (
      <div className="flex justify-center items-center gap-2">
        <SymbolIcon className="h-5 w-5 animate-spin text-neutral-600" />
        <p>Pobieram dodatkowe informacje o filmie...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6 px-1 max-h-[calc(100svh_-_150px)] overflow-y-scroll"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tytuł filmu<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="text"
                    placeholder="Shrek 2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genres"
            render={({ field: { onChange, value, ...restProps } }) => (
              <FormItem>
                <FormLabel>
                  Gatunki<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    data={
                      movieGeneres?.map((genere) => ({
                        label: genere.genre,
                        value: genere.id,
                      })) ?? []
                    }
                    inputProps={{
                      ...restProps,
                      placeholder: "Wybierz gatunki...",
                    }}
                    selectedIds={value}
                    onSelectedChanged={(newValue: number[]) =>
                      onChange(newValue)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  URL do miniaturki<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Reżyser<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="text"
                    placeholder="Andrew Adamson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Rok produkcji<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onWheelCapture={(e) => e.currentTarget.blur()}
                    type="number"
                    placeholder="2004"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imdb_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Rok produkcji<sup className="text-destructive/65">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onWheelCapture={(e) => e.currentTarget.blur()}
                    type="number"
                    placeholder="7.3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis filmu</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    rows={4}
                    className="flex h-18 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storyline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis fabuły</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    rows={4}
                    className="flex h-18 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          Edytuj film
        </Button>
      </form>
    </Form>
  );
};

export const DeleteMovieForm = ({
  existingMovie,
  onClose,
}: {
  existingMovie?: Movie & { genres: number[] };
  onClose: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteMovie(existingMovie!)
        .then((result) => {
          toast.success(`Film "${result.title}" został pomyślnie usunięty.`);
          onClose();
        })
        .catch(() => {
          toast.error("Coś poszło nie tak podczas usuwania filmu.");
        });
    });
  };

  if (!existingMovie?.id || !existingMovie.title) {
    return (
      <div className="flex justify-center items-center gap-2">
        <SymbolIcon className="h-5 w-5 animate-spin text-neutral-600" />
        <p>Pobieram dodatkowe informacje o zasobie...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <p>
        Czy jesteś pewien, że chcesz usunąć film o nazwie &ldquo;
        {existingMovie.title}&rdquo;?
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
        Usuń film
      </Button>
    </div>
  );
};
