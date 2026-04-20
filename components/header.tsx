import Link from "next/link";

function LogoMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-4 w-4 text-black"
      fill="currentColor"
    >
      <path d="M10 2.8 18 17.2H2L10 2.8Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5 text-neutral-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-white text-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-9">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <LogoMark />
            <span className="text-lg">Vercel Daily</span>
          </Link>

          <nav className="flex items-center gap-7 text-sm text-neutral-500">
            <Link className="transition hover:text-black" href="/">
              Home
            </Link>
            <Link className="transition hover:text-black" href="/search">
              Search
            </Link>
          </nav>
        </div>

        <button
          type="button"
          aria-label="Subscribe"
          className="rounded-md p-1 transition hover:bg-neutral-100"
        >
          <BellIcon />
        </button>
      </div>
    </header>
  );
}