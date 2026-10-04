import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="rounded-full border border-white/10 bg-card px-4 py-1.5 text-xs font-semibold text-mute">
        404 Not Found
      </span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Page or Game Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink2">
        The page or game you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-xl border border-line bg-card px-4 py-2 text-sm font-medium text-white hover:border-brand transition"
        >
          Return Home
        </Link>
        <Link
          href="/games"
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition shadow-sm"
        >
          Browse Games
        </Link>
      </div>
    </div>
  );
}
