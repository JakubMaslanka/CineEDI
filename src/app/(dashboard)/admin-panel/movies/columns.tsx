"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Movie } from "@/lib/db.schema";

import { useDialog } from "./dialogs";

export const columns: ColumnDef<Movie>[] = [
  {
    id: "image_url",
    accessorKey: "image_url",
    header: () => (
      <div className="inline-flex justify-center items-center gap-1 w-full cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out">
        <span className="text-center">Miniaturka</span>
      </div>
    ),
    cell: ({ row }) => {
      const { image_url, title } = row.original;

      if (!image_url) return null;

      return (
        <img
          className="w-12 h-15 mx-auto"
          src={image_url}
          alt={`${title} poster`}
        ></img>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div
        className="inline-flex items-center justify-between w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Tytuł filmu</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <div
        className="inline-flex items-center justify-between w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Rok produkcji</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: "director",
    header: ({ column }) => (
      <div
        className="inline-flex items-center justify-between w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Reżyser</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: "imdb_rating",
    header: ({ column }) => (
      <div
        className="inline-flex items-center justify-between w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Ocena</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const { imdb_rating } = row.original;

      if (!imdb_rating) return null;

      return (
        <div className="flex items-center justify-center">
          <Badge className="gap-1" variant={"secondary"}>
            <StarFilledIcon className="shrink-0 h-3 w-3 text-yellow-500" />
            {imdb_rating}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "create_at",
    header: ({ column }) => (
      <div
        className="inline-flex items-center justify-between w-full gap-1 cursor-pointer text-neutral-200 hover:text-neutral-400 transition-colors duration-200 ease-in-out"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Data dodania</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const { create_at } = row.original;

      if (!create_at) return null;

      return `${format(create_at, "dd.MM.yyyy")}, godz. ${format(
        create_at,
        "HH:mm"
      )}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line
      const { openDialog } = useDialog();
      const { id } = row.original;

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
              onClick={() => openDialog({ mode: "update", id })}
            >
              Edytuj film
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => openDialog({ mode: "delete", id })}
            >
              Usuń film
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
