import { Suspense } from "react";
import Link from "next/link";
import { Inter, Poppins } from "next/font/google";
import { cn } from "@/utils/cn";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HeroButton } from "@/components/ui/hero-button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  return (
    <>
      <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1
            className={cn(
              "relative z-10 text-5xl md:text-7xl text-center font-sans font-bold",
              poppins.className
            )}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
              cine
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cineedi to-cineedi/60">
              EDI
            </span>
          </h1>
          <p
            className={cn(
              "text-neutral-500 max-w-lg mx-auto my-4 text-sm text-center relative z-10",
              inter.className
            )}
          >
            &ldquo;CineEDI&rdquo; to platforma streamingowa, która umożliwia
            użytkownikom dostęp do szerokiej biblioteki filmów i seriali do
            wypożyczania. Platforma wykorzystuje technologię EDI do zarządzania
            transakcjami, przesyłania faktur, zarządzania licencjami i
            dystrybucją treści filmowych.
          </p>
          <p
            className={cn(
              "text-neutral-600 max-w-lg mx-auto my-4 text-sm text-center relative z-10",
              inter.className
            )}
          >
            Platforma została zrealizowana jako projekt semestralny w ramach
            przedmiotu &ldquo;Technologie Webowe&rdquo; na Akademii
            Humanistyczno-Ekonomicznej w Łodzi przez Jakuba Maślanke.
          </p>
          <div className="w-full relative z-10 mt-12 flex items-center justify-center">
            <Link href="/auth/sign-in">
              <Suspense>
                <HeroButton>Rozpocznij!</HeroButton>
              </Suspense>
            </Link>
          </div>
        </div>
        <BackgroundBeams />
      </div>
      <div className="absolute bottom-0 w-full">
        <p
          className={cn(
            "text-neutral-300 max-w-lg mx-auto my-4 text-sm text-center relative z-10",
            inter.className
          )}
        >
          &copy; {new Date().getFullYear()} cineedi.online
          <br />
          Wykonane przez: Jakub Maślanka
        </p>
      </div>
    </>
  );
}
