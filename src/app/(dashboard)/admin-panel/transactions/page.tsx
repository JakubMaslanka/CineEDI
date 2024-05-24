import { redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { Transaction, columns } from "./columns";
import { DataTable } from "./data-table";

const TransactionsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (session?.user.role !== "admin") {
    redirect("/home");
  }

  const rents = await db.query.rentals
    .findMany({
      with: {
        user_id: true,
        movie_id: true,
        edi_transaction_id: true,
      },
    })
    .then(
      (data) =>
        data.map((rent) => ({
          rentalId: rent.id,
          userName: rent.user_id.name!,
          userEmail: rent.user_id.email,
          status: rent.status,
          movieTitle: rent.movie_id.title,
          rentalStartDate: `${format(
            rent.rental_date!,
            "dd.MM.yyyy"
          )}, godz. ${format(rent.rental_date!, "HH:mm")}`,
          rentalEndDate: `${format(
            rent.rental_end_date,
            "dd.MM.yyyy"
          )}, godz. ${format(rent.rental_end_date!, "HH:mm")}`,
        })) as Transaction[]
    );

  return (
    <div className="container mx-auto">
      <p className="text-neutral-400 text-sm font-bold">
        Lista wszystkich wypożyczonych treści przez użytkowników cineEDI:
      </p>
      <p className="text-destructive/80 text-xs font-light">
        Tylko do odczytu!
      </p>
      <DataTable columns={columns} data={rents} />
    </div>
  );
};

export default TransactionsPage;
