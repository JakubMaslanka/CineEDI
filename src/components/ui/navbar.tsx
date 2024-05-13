"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  MagnifyingGlassIcon,
  RocketIcon,
  FaceIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/utils/cn";
import { CommandDialog, CommandInput, CommandList } from "./command";

const DEFAULT_NAVBAR_LINKS = [
  { id: 1, name: "Home", path: "/home" },
  { id: 2, name: "Ostatnio dodane", path: "/recently-added" },
  { id: 3, name: "Moja Lista", path: "/my-list" },
];

export const Navbar = ({
  onSignOutAction,
}: {
  onSignOutAction: string | ((formData: FormData) => void) | undefined;
}) => {
  const [searchCommandOpen, setSearchCommandOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = (path: string) => path === pathname;

  const handleSearchCommandClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search_query");
    if (searchInput !== "") {
      params.set("search_query", searchInput);
    }

    router.push("/home" + `?${params.toString()}`, {
      scroll: false,
    });

    setSearchInput("");
    setSearchCommandOpen(false);
  }, [router, searchInput, searchParams]);

  useEffect(() => {
    if (!searchCommandOpen) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchCommandClose();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [handleSearchCommandClose, searchCommandOpen]);

  return (
    <Disclosure as="nav" className="bg-zinc-900 shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl w-full px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:text-gray-300 focus:outline-none">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Otwórz menu mobilne</span>
                  {open ? (
                    <Cross1Icon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <HamburgerMenuIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    width={87}
                    height={32}
                    quality={100}
                    loading="eager"
                    className="h-8 w-auto"
                    src="/logo.svg"
                    alt="cineEDI logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {DEFAULT_NAVBAR_LINKS.map((link) => (
                    <Link
                      key={link.id}
                      href={link.path}
                      className={cn(
                        "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300",
                        isActive(link.path)
                          ? "border-cineedi text-white font-bold"
                          : "hover:border-cineedi/50 hover:text-gray-400"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex gap-x-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  onClick={() => setSearchCommandOpen(true)}
                  className="relative rounded-full bg-zinc-950 p-1 text-gray-200 hover:text-cineedi/80 focus:outline-none focus:ring-2 focus:ring-cineedi focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Szukaj filmu</span>
                  <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="relative rounded-full bg-zinc-950 p-1 text-gray-200 hover:text-cineedi/80 focus:outline-none focus:ring-2 focus:ring-cineedi focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Otworz powiadomienia</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-cineedi focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <Image
                        width={44}
                        height={44}
                        className="h-8 w-8 rounded-full"
                        src="https://api.dicebear.com/8.x/fun-emoji/svg"
                        alt="Avatar uzytkownika"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <Link
                          href="/settings/profile"
                          className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:text-gray-500 hover:translate-x-1 transition-all duration-200 ease-in-out"
                        >
                          Profil
                        </Link>
                      </Menu.Item>
                      {session.data?.user.role === "admin" && (
                        <Menu.Item>
                          <Link
                            href="/admin-panel"
                            className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:text-gray-500 hover:translate-x-1 transition-all duration-200 ease-in-out"
                          >
                            Panel administratora
                          </Link>
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        <Link
                          href="/settings/profile"
                          className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:text-gray-500 hover:translate-x-1 transition-all duration-200 ease-in-out"
                        >
                          Historia transakcji
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <form action={onSignOutAction}>
                          <button
                            type="submit"
                            className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:text-gray-500 hover:translate-x-1 transition-all duration-200 ease-in-out"
                          >
                            Wyloguj się
                          </button>
                        </form>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <CommandDialog
            open={searchCommandOpen}
            onOpenChange={handleSearchCommandClose}
          >
            <CommandInput
              className="border-none focus:outline-none focus:ring-transparent focus:border-transparent"
              placeholder="Wyszukaj swój ulubiony film..."
              value={searchInput}
              onValueChange={setSearchInput}
            />
            <CommandList className="hidden" />
          </CommandDialog>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-4 pt-2">
              {DEFAULT_NAVBAR_LINKS.map((link) => (
                <Disclosure.Button
                  as={Link}
                  key={link.id}
                  href={link.path}
                  className={cn(
                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                    isActive(link.path)
                      ? "bg-transparent border-cineedi text-cineedi"
                      : "border-transparent text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {link.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
