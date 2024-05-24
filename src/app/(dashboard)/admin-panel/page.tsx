import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (session?.user.role !== "admin") {
    redirect("/home");
  }

  redirect("/admin-panel/movies");
};

export default Page;
