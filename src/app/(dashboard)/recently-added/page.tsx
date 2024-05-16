import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MoviesGrid } from "@/components/home/movies-grid";

const RecentlyAddedMoviesPage = async () => {
  const session = await auth();

  if (!session) redirect("/auth/sign-in");

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      TODO
    </div>
  );
};

export default RecentlyAddedMoviesPage;
