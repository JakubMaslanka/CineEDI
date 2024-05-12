import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DialogProvider } from "./dialogs";
import { getAllGeneres } from "./actions";

const Page = async () => {
  const session = await auth();
  const data = await getAllGeneres();

  if (session?.user.role !== "admin") {
    redirect("/home");
  }

  return (
    <div className="container mx-auto py-10">
      <p className="text-neutral-400 text-xs font-light">
        Zbiór kategorii filmów dostępnych do ustawienia podczas dodawania filmu.
        Bądź dostępnych do ustawienia jako preferowane gatunki podczas
        rejestracji nowego konta.
      </p>
      <DialogProvider>
        <DataTable columns={columns} data={data} />
      </DialogProvider>
    </div>
  );
};

export default Page;
