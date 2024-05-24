import { redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { columns } from "./columns";
import { DataTable } from "./data-table";

const UsersPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (session?.user.role !== "admin") {
    redirect("/home");
  }

  const users = await db.query.users.findMany().then((data) =>
    data.map((user) => ({
      id: user.id,
      name: user.name!,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      firstTimeLoggedIn: user.firstTimeLoggedIn,
      createdAt: `${format(user.created_at!, "dd.MM.yyyy")}, godz. ${format(
        user.created_at!,
        "HH:mm"
      )}`,
    }))
  );

  return (
    <div className="container mx-auto">
      <p className="text-neutral-400 text-sm font-bold">
        Lista wszystkich użytkowników cineEDI:
      </p>
      <p className="text-destructive/80 text-xs font-light">
        Tylko do odczytu!
      </p>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
