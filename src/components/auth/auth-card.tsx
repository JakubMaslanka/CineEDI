import Link from "next/link";
import { type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  <Card className="w-[400px] shadow-md">
    <CardHeader>{title}</CardHeader>
    <CardContent>{children}</CardContent>
    <CardFooter>
      <Button variant="link" className="w-full" size="sm" asChild>
        <Link className="font-light" href={footerHref}>
          {footerText}
        </Link>
      </Button>
    </CardFooter>
  </Card>
);
