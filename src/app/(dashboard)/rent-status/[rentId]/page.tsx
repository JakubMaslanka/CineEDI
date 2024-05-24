import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { PlayIcon } from "@radix-ui/react-icons";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadEdiButton } from "@/components/movie/download-edi-button";

const RentStatusPage = async ({
  params: { rentId },
}: {
  params: { rentId: string };
}) => {
  const session = await auth();
  if (!session) redirect("/auth/sign-in");

  let query = db.query.rentals.findFirst({
    where: (schema, { and, eq }) =>
      and(eq(schema.id, +rentId), eq(schema.user_id, session.user.id)),
    with: {
      user_id: true,
      movie_id: true,
      edi_transaction_id: true,
    },
  });

  if (session.user.role === "admin") {
    query = db.query.rentals.findFirst({
      where: (schema, { and, eq }) => and(eq(schema.id, +rentId)),
      with: {
        user_id: true,
        movie_id: true,
        edi_transaction_id: true,
      },
    });
  }

  const rent = await query.execute();

  if (!rent) notFound();

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <main className="flex-1">
        <div className="flex items-baseline justify-between border-b border-neutral-400 pb-6 pt-4">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-200">
            Status wypożyczenia:
          </h1>
        </div>

        <div className="mx-auto max-w-2xl py-4 mb-16 mt-2.5 grid gap-y-12 lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8">
          <div className="flex flex-col space-y-2 font-sans lg:border-r lg:border-neutral-500 lg:pr-4">
            <p className="text-sm text-neutral-400">Wypożyczony film:</p>
            <div className="aspect-h-1 aspect-w-1 max-h-96 overflow-hidden rounded-lg">
              <img
                src={rent.movie_id.image_url!}
                alt={`${rent.movie_id.title} poster`}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-3xl text-neutral-100">{rent.movie_id.title}</p>
              <p className="text-base text-neutral-300">
                Reżyser: {rent.movie_id.director}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-2 font-sans">
            <p className="text-sm text-neutral-400">Szczegóły wypożyczenia:</p>
            <div className="space-y-6">
              <div className="text-base text-neutral-300">
                Status:{"   "}
                {rent.status === "ended" ? (
                  <Badge variant="destructive">Zakończone</Badge>
                ) : (
                  <Badge
                    variant="default"
                    className="bg-green-600 hover:bg-green-800"
                  >
                    W trakcie wypożyczenia
                  </Badge>
                )}
              </div>
              <p className="text-base text-neutral-300">
                {rent?.rental_date &&
                  `Data rozpoczęcia: ${format(
                    rent?.rental_date,
                    "dd.MM.yyyy"
                  )}, godz. ${format(rent?.rental_date, "HH:mm")} `}
              </p>
              <p className="text-base text-neutral-300">
                {rent?.rental_date &&
                  `Data zakończenia: ${format(
                    rent?.rental_end_date,
                    "dd.MM.yyyy"
                  )}, godz. ${format(rent?.rental_end_date, "HH:mm")} `}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-2 font-sans">
            <p className="text-sm text-neutral-400">Operacje:</p>
            <div className="flex flex-col space-y-6">
              <DownloadEdiButton
                rentId={rent.id}
                ediData={rent.edi_transaction_id.edi_string}
              />
              {rent.status !== "ended" && (
                <Button variant="outline" className="bg-transparent" asChild>
                  <Link href={`/player/${rent.movie_id.id}`}>
                    <>
                      <PlayIcon
                        className="mr-2 h-4 w-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>Odtwórz film</span>
                    </>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RentStatusPage;
