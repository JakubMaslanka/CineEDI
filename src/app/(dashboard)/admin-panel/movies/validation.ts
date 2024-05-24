import { z } from "zod";

export const movieValidationSchema = z.object({
  title: z
    .string({ required_error: "Tytuł filmu jest wymagany!" })
    .min(1, { message: "Tytuł filmu jest wymagany!" }),
  description: z.string().optional(),
  storyline: z.string().optional(),
  image_url: z
    .string({ required_error: "Adres do miniatury jest wymagany!" })
    .min(1, { message: "Adres do miniatury jest wymagany!" })
    .url({
      message: "Podaj poprawny adres URL!",
    }),
  year: z.coerce
    .number()
    .min(1888, `Rok produkcji nie może być niższy niż 1888r`)
    .max(
      new Date().getFullYear(),
      `Rok produkcji nie może być większy niż ${new Date().getFullYear()}r`
    ),
  director: z
    .string({ required_error: "Reżyser jest wymagany!" })
    .min(1, { message: "Reżyser jest wymagany!" }),
  imdb_rating: z.coerce
    .number({ message: "Ocena filmu jest wymagana!" })
    .min(1, "Ocena nie może być niższa niż 1")
    .max(10, "Ocena nie może być większa niż 10"),
  genres: z
    .array(z.number())
    .min(1, { message: "Przynajmniej jeden gatunek jest wymagany!" }),
});
