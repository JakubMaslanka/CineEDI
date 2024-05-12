import Link from "next/link";

export default function Error() {
  return (
    <div className="flex h-svh flex-col bg-neutral-900 pb-12 pt-16">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
          <a href="#" className="inline-flex">
            <span className="sr-only">cineEDI</span>
            <img className="h-12 w-auto" src="/logo.svg" alt="cineEDI logo" />
          </a>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-cineedi">404</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Nie znaleziono strony.
            </h1>
            <p className="mt-2 text-base text-gray-400">
              Przepraszamy, ale nie mogliśmy znaleźć strony, której szukasz.
            </p>
            <div className="mt-6">
              <Link
                href="/home"
                className="text-base font-medium text-cineedi hover:text-cineedi/60"
              >
                Go back home
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
