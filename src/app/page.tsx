import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function Home() {
  return (
    <main
      className={cn("container mx-auto px-4 sm:px-6 lg:px-8", font.className)}
    >
      <div className="flex flex-col justify-center items-center gap-y-8 h-svh text-white">
        <h1 className="font-bold text-2xl">
          Filmy, seriale i wiele więcej bez ograniczeń
        </h1>
        <p className="font-light text-sm">
          Oglądaj wszędzie. Anuluj w każdej chwili.
        </p>

        <Link href="/auth/sign-in">
          <Button className="bg-destructive hover:bg-destructive/80">
            Rozpocznij
          </Button>
        </Link>
      </div>
    </main>
  );
}
