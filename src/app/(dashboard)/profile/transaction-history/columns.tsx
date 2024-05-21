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

export interface TransactionHistory {
  status: string;
  movieTitle: string;
  rentalId: number;
  rentalStartDate: string;
  rentalEndDate: string;
}

export const columns: ColumnDef<TransactionHistory>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="inline-flex gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        <span>Status</span>
      </div>
    ),
    cell: ({ row }) => {
      const { status } = row.original;

      return status === "ended" ? (
        <Badge variant="destructive">Zakończone</Badge>
      ) : (
        <Badge variant="default" className="bg-green-600 hover:bg-green-800">
          W trakcie
        </Badge>
      );
    },
  },
  {
    accessorKey: "movieTitle",
    header: ({ column }) => (
      <div
        className="inline-flex gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Tytuł filmu</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: "rentalStartDate",
    header: () => (
      <div className="inline-flex gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        <span>Data wypożyczenia</span>
      </div>
    ),
  },
  {
    accessorKey: "rentalEndDate",
    header: () => (
      <div className="inline-flex gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        <span>Data zakończenia</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { rentalId } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Otwórz menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Dostępne akcje</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/rent-status/${rentalId}`}>
                Zobacz status wypożyczenia
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
