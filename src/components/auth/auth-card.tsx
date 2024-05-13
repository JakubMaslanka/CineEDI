import Link from "next/link";
import Image from "next/image";
import { type ReactNode } from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/utils/cn";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export const AuthCard = ({
  children,
  title,
  footerText,
  footerHref,
}: {
  children: ReactNode;
  title: string;
  footerText: string;
  footerHref: string;
}) => (
  <Card className="w-[400px] shadow-md z-50 bg-neutral-900 border-neutral-800">
    <CardHeader className="gap-6">
      <img className="h-10 w-auto" src="/logo.svg" alt="cineEDI logo" />
      <p
        className={cn(
          "text-neutral-300 max-w-lg mx-auto my-4 text-md text-center relative z-10",
          poppins.className
        )}
      >
        {title}
      </p>
    </CardHeader>
    <CardContent className={cn("text-neutral-200", poppins.className)}>
      {children}
    </CardContent>
    <CardFooter>
      <Button
        variant="link"
        className="w-full text-neutral-100 font-light"
        size="sm"
        asChild
      >
        <Link href={footerHref}>{footerText}</Link>
      </Button>
    </CardFooter>
  </Card>
);
