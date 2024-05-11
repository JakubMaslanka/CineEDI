import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { cn } from "@/utils/cn";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "cineEDI | Wypożyczalnia filmów online",
  description: "Wypożyczalnia filmów online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, poppins.className, "bg-zinc-950")}>
        {children}
      </body>
    </html>
  );
}
