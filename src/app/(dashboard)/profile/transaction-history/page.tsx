import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { TransactionHistory, columns } from "./columns";
import { DataTable } from "./data-table";
import { format } from "date-fns";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const rents = await db.query.rentals
    .findMany({
      where: (schema, { eq }) => eq(schema.user_id, session?.user.id),
      with: {
        user_id: true,
        movie_id: true,
        edi_transaction_id: true,
      },
    })
    .then(
      (data) =>
        data.map((rent) => ({
          status: rent.status,
          movieTitle: rent.movie_id.title,
          rentalId: rent.id,
          rentalStartDate: `${format(
            rent.rental_date!,
            "dd.MM.yyyy"
          )}, godz. ${format(rent.rental_date!, "HH:mm")}`,
          rentalEndDate: `${format(
            rent.rental_end_date,
            "dd.MM.yyyy"
          )}, godz. ${format(rent.rental_end_date!, "HH:mm")}`,
        })) as TransactionHistory[]
    );

  return (
    <div className="container mx-auto">
      <p className="text-neutral-400 text-sm font-bold">
        Lista wypożyczonych przez Ciebie filmów:
      </p>
      <DataTable columns={columns} data={rents} />
    </div>
  );
};

export default Page;
