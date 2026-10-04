import Link from "next/link";

export function PreviewBanner() {
  return (
    <aside
      aria-label="Preview Announcement"
      className="sticky top-0 z-50 w-full bg-bg/90 backdrop-blur-md border-b border-line/60 px-3 py-2 text-xs"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 font-medium text-hi shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-hi animate-pulse" />
            V2 Preview
          </span>
          <p className="text-ink font-normal">
            <span className="font-semibold text-white">✨ Designeer Gaming V2 Preview Mode</span>
            <span className="text-mute hidden sm:inline"> · Live production site is untouched</span>
          </p>
        </div>

        <nav aria-label="Preview Navigation" className="flex items-center gap-2 font-medium">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-card/80 px-2.5 py-1 text-ink2 transition-colors hover:border-brand/40 hover:text-white"
          >
            <span aria-hidden="true">&larr;</span> Back to Live Site
          </Link>
          <Link
            href="/preview/games"
            className="inline-flex items-center gap-1 rounded-lg border border-brand/40 bg-gradient-to-r from-brand/20 to-brand2/20 px-2.5 py-1 text-hi shadow-sm transition-all hover:border-hi hover:text-white"
          >
            Top-Up Games <span aria-hidden="true">&rarr;</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
