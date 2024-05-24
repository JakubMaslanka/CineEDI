import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: (schema, { eq }) => eq(schema.id, session.user.id),
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="container mx-auto">
      <p className="text-neutral-400 text-sm font-bold">Ustawienia profilu</p>
      <p className="text-destructive/60 text-xs font-light">
        Wartości w formularzu są tylko do odczytu!
        <br /> Aby zmodyfikować informacje w profilu, albo usunąć konto
        skontakuj się z nami pod adresem: <u>kontakt@cineedi.online</u>
      </p>
      <div className="pb-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 lg:space-x-4">
          <div className="sm:col-span-4 lg:col-span-3 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-neutral-400"
              >
                Nazwa użytkownika
              </label>
              <div className="flex rounded-md shadow-sm mt-1 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="username"
                  id="username"
                  disabled
                  value={user.name!}
                  autoComplete="username"
                  className="block flex-1 border-0 bg-transparent py-1.5 text-neutral-400 placeholder:text-gray-400 disabled:text-gray-600 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="janesmith"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="flex justify-between text-sm font-medium leading-6 text-neutral-400"
              >
                <span>E-mail</span>
                <span className="text-neutral-400">
                  {user?.emailVerified && (
                    <Badge
                      variant="default"
                      className="text-xs bg-green-600 hover:bg-green-800"
                    >
                      Zweryfikowany
                    </Badge>
                  )}
                </span>
              </label>
              <div className="flex rounded-md shadow-sm mt-1 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="email"
                  id="email"
                  disabled
                  value={user.email}
                  autoComplete="email"
                  className="block flex-1 border-0 bg-transparent py-1.5 text-neutral-400 placeholder:text-gray-400 disabled:text-gray-600 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="janesmith"
                />
              </div>
            </div>
          </div>

          {user.image && (
            <div className="lg:col-span-3">
              <label
                htmlFor="Avatar"
                className="block text-sm font-medium leading-6 text-neutral-400"
              >
                Avatar
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <img
                  src={user.image}
                  className="h-24 w-24 rounded-full text-gray-300"
                  alt={`${user.name} avatar image`}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
