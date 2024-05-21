"use client";

import { Fragment, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Transition, Dialog, Disclosure, Menu } from "@headlessui/react";
import {
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
  Cross1Icon,
  MixerHorizontalIcon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Movie, MovieGenres } from "@/lib/db.schema";
import { cn } from "@/utils/cn";

import { MoviesGrid } from "./movies-grid";

const sortOptions = [
  { name: "Ocena IMDb", key: "rating" },
  { name: "Rok Produkcji", key: "year" },
  { name: "Tytuł: A-Z", key: "title_asc" },
  { name: "Tytuł: Z-A", key: "title_desc" },
];

const Stars = ({ count }: { count: number }) => {
  if (count < 0 || count > 10) throw new Error("Invalid count");
  return (
    <div className="flex flex-row gap-0.5">
      {Array.from({ length: 10 }).map((_, index) => {
        if (index + 1 <= count) {
          return (
            <StarFilledIcon key={index} className="w-4 h-4 text-yellow-500" />
          );
        } else {
          return <StarIcon key={index} className="w-4 h-4 text-yellow-500" />;
        }
      })}
    </div>
  );
};

export const MoviesWithFilterLayout = ({
  movies,
  genres,
  directors,
}: {
  movies: Movie[];
  genres: MovieGenres[];
  directors: {
    director: string | null;
  }[];
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQueryString = useCallback(
    (name: string, value: string, allowMultiSelection = true) => {
      const params = new URLSearchParams(searchParams.toString());

      if (allowMultiSelection) {
        const values = params.get(name)?.split(",") ?? [];
        const valueIndex = values.indexOf(value);

        if (valueIndex > -1) {
          values.splice(valueIndex, 1);
        } else {
          values.push(value);
        }

        values.length > 0
          ? params.set(name, values.join(","))
          : params.delete(name);
      } else {
        params.set(name, value);
      }

      router.push(pathname + `?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const filters = [
    {
      id: "genres",
      name: "Gatunki filmów",
      options: genres.map(({ id, genre }) => ({
        value: id.toString(),
        label: genre,
      })),
    },
    {
      id: "directors",
      name: "Reżyserzy",
      options: [
        ...new Set(directors.map(({ director }) => director ?? "")),
      ].map((director) => ({
        value: director,
        label: director,
      })),
    },
    {
      id: "rating",
      name: "Oceny",
      options: [
        { value: "1", label: <Stars count={1} /> },
        { value: "2", label: <Stars count={2} /> },
        { value: "3", label: <Stars count={3} /> },
        { value: "4", label: <Stars count={4} /> },
        { value: "5", label: <Stars count={5} /> },
        { value: "6", label: <Stars count={6} /> },
        { value: "7", label: <Stars count={7} /> },
        { value: "8", label: <Stars count={8} /> },
        { value: "9", label: <Stars count={9} /> },
        { value: "10", label: <Stars count={10} /> },
      ],
    },
  ];

  return (
    <div>
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Filtruj zasoby:
                  </h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <Cross1Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4 border-t border-gray-200">
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    onChange={(e) => {
                                      updateQueryString(
                                        `${section.id}Filtering`,
                                        e.target.value,
                                        section.id === "rating" ? false : true
                                      );
                                    }}
                                    defaultChecked={
                                      section.id === "rating"
                                        ? searchParams.get(
                                            `${section.id}Filtering`
                                          ) === option.value
                                        : searchParams
                                            .get(`${section.id}Filtering`)
                                            ?.split(",")
                                            .includes(option.value)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-neutral-400 pb-6 pt-4">
          <h1 className="text-xl lg:text-4xl font-bold tracking-tight text-neutral-200">
            Zasoby wypożyczalni:
          </h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-neutral-200 hover:text-neutral-400">
                  Sortowanie
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-600"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map(({ name, key }) => (
                      <Menu.Item key={name}>
                        {({ active }) => (
                          <div
                            onClick={() =>
                              updateQueryString("sortBy", key, false)
                            }
                            className={cn(
                              searchParams.get("sortBy") === key
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm cursor-pointer"
                            )}
                          >
                            {name}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">Filtry</span>
              <MixerHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block">
              {filters.map((section) => (
                <Disclosure
                  as="div"
                  key={section.id}
                  className="border-b border-neutral-600 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-neutral-500 hover:text-neutral-700">
                          <span className="font-medium text-neutral-200">
                            {section.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                defaultValue={option.value}
                                type="checkbox"
                                onChange={(e) => {
                                  updateQueryString(
                                    `${section.id}Filtering`,
                                    e.target.value,
                                    section.id === "rating" ? false : true
                                  );
                                }}
                                defaultChecked={
                                  section.id === "rating"
                                    ? searchParams.get(
                                        `${section.id}Filtering`
                                      ) === option.value
                                    : searchParams
                                        .get(`${section.id}Filtering`)
                                        ?.split(",")
                                        .includes(option.value)
                                }
                                className="h-4 w-4 rounded border-cineedi text-cineedi focus:ring-cineedi/25 ring-0"
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-neutral-300/95"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </form>

            {/* Product grid */}
            <div className="lg:col-span-3">
              <MoviesGrid movies={movies} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
