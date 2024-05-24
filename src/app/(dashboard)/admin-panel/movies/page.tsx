import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DialogProvider } from "./dialogs";
import { getMovies } from "./actions";

const MoviesPage = async () => {
  const session = await auth();
  const data = await getMovies();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (session?.user.role !== "admin") {
    redirect("/home");
  }

  return (
    <div className="container mx-auto">
      <p className="text-neutral-400 text-sm font-bold">
        Zbiór wszystkich filmów dostępnych do wypożyczenia na platformie
        cineEDI:
      </p>
      <DialogProvider>
        <DataTable columns={columns} data={data} />
      </DialogProvider>
    </div>
  );
};

export default MoviesPage;
