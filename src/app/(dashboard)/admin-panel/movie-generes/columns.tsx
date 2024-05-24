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
import type { MovieGenres } from "@/lib/db.schema";

import { useDialog } from "./dialogs";

export const columns: ColumnDef<MovieGenres>[] = [
  {
    accessorKey: "genre",
    header: ({ column }) => (
      <div
        className="inline-flex gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Gatunek</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line
      const { openDialog } = useDialog();
      const genre = row.original;

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
            <DropdownMenuItem
              onClick={() => openDialog({ mode: "update", id: genre.id })}
            >
              Edytuj gatunek
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => openDialog({ mode: "delete", id: genre.id })}
            >
              Usuń gatunek
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
