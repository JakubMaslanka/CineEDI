"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DEFAULT_SIDEBAR_LINKS = [
  { id: 1, name: "Profil", path: "/profile/settings" },
  { id: 2, name: "Historia transakcji", path: "/profile/transaction-history" },
];

const AdminPanelLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  return (
    <div className="h-[calc(100svh_-_181px)]">
      <div className="mx-auto grid w-full max-w-6xl gap-2 pb-8">
        <h1 className="text-3xl font-semibold">Twój profil</h1>
        <div className="border-b border-neutral-500 mt-2"></div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground border-r-1 border-neutral-100">
          {DEFAULT_SIDEBAR_LINKS.map(({ id, name, path }) => (
            <Link
              href={path}
              key={id}
              className={cn(
                "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300",
                isActive(path)
                  ? "font-semibold text-neutral-100"
                  : "font-normal text-neutral-400"
              )}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
