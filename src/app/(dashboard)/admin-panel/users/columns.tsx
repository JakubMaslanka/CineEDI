"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  emailVerified: null | Date;
  firstTimeLoggedIn: null | boolean;
  createdAt: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div
        className="inline-flex items-center justify-between w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-left">Nazwa Użytkownika</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        className="inline-flex items-center justify-between w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-left">Email</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: "emailVerified",
    header: () => (
      <div className="inline-flex items-center w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        <span>Email zweryfikowany</span>
      </div>
    ),
    cell: ({ row }) => {
      const { emailVerified } = row.original;

      return emailVerified ? (
        <Badge variant="default" className="bg-green-600 hover:bg-green-800">
          Zweryfikowany
        </Badge>
      ) : (
        <Badge variant="destructive">Nie zweryfikowany</Badge>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => (
      <div className="inline-flex items-center w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        <span>Rola</span>
      </div>
    ),
    cell: ({ row }) => {
      const { role } = row.original;

      return role === "admin" ? (
        <Badge variant="secondary">Administrator</Badge>
      ) : (
        <Badge variant="secondary">Użytkownik</Badge>
      );
    },
  },
  {
    accessorKey: "firstTimeLoggedIn",
    header: () => (
      <div className="inline-flex items-center w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        <span>Konfiguracja konta zakończona</span>
      </div>
    ),
    cell: ({ row }) => {
      const { firstTimeLoggedIn } = row.original;

      return !firstTimeLoggedIn ? (
        <Badge variant="default" className="bg-green-600 hover:bg-green-800">
          Prawda
        </Badge>
      ) : (
        <Badge variant="destructive">Fałsz</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="inline-flex items-center w-full text-left gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        Data utworzenia konta
      </div>
    ),
  },
];
