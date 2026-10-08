import Link from "next/link";

export function PreviewBanner() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#11193C] border border-[#233062] px-4 py-2.5 rounded-full shadow-[0_8px_32px_rgba(11,25,60,0.5)]">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#0BC5FF] animate-pulse" />
        <span className="text-[11px] font-bold text-white tracking-wide">V2 Preview</span>
      </div>
      <div className="w-px h-3 bg-[#233062]" />
      <Link href="/preview/index" className="text-[11px] font-semibold text-[#C4C5D9] hover:text-white transition-colors">
        Index
      </Link>
      <div className="w-px h-3 bg-[#233062]" />
      <Link href="/" className="text-[11px] font-semibold text-[#C4C5D9] hover:text-white transition-colors">
        Live Site
      </Link>
      <div className="w-px h-3 bg-[#233062]" />
      <Link href="/preview/games" className="text-[11px] font-bold text-[#0BC5FF] hover:text-white transition-colors">
        Top-Up &rarr;
      </Link>
    </div>
  );
}
