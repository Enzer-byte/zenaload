"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/config";

interface NavbarV2Props {
  currentPath?: string;
  preview?: boolean;
}

export function NavbarV2({ currentPath, preview }: NavbarV2Props) {
  const pathname = usePathname();
  const isPreview = preview || pathname?.startsWith("/preview");
  const prefix = isPreview ? "/preview" : "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: `${prefix}/games`, label: "Games" },
    { href: `${prefix}/how-it-works`, label: "How it works" },
    { href: `${prefix}/track-order`, label: "Track order" },
    { href: `${prefix}/account`, label: "Device Hub" },
    { href: `${prefix}/support`, label: "Support & FAQ" },
  ];

  return (
    <header className="bg-on-background sticky top-0 z-50 flex items-center justify-between px-4 md:px-12 w-full h-16 shadow-sm border-b border-surface-variant/20">
      <div className="flex items-center gap-4">
        {/* Brand Logo & Name verbatim from Stitch */}
        <Link href={prefix || "/"} className="flex items-center gap-2 group">
          <img
            alt="Zenaload"
            className="w-8 h-8 rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VOFgqEf9RJagFErx2Kd_YEY4Z-oktKNnNMoWGKjdnO9GRutDbHOEdp-9seSmGIoFYEqZmxcXwHS4PPfrDeldTiOh_0NMgJpWIvk5bH0F-k66w3dGLJ1laXjq5X7X8ncByVApfXyT-PJkuJYbVxiaLqRq3lHzAv4_1L8gGUWmYHWU9-vA665unC5PfkJ3Daw3qmoGuKCcFUsn_SNp7hSdVTu3tbr6LCX9CYryxcmDmEScc9_PeTZ9I8f2Y"
          />
          <span className="text-xl font-extrabold text-surface-container-lowest tracking-tight">
            {config.brand}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 ml-6 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative h-full flex items-center text-[13px] font-bold tracking-wide transition-colors duration-150 ${
                  isActive
                    ? "text-[#FFFFFF]"
                    : "text-[#C4C5D9] hover:text-[#FFFFFF]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#0BC5FF] via-[#2D5BFF] to-[#5A4BFF] rounded-t-full shadow-[0px_8px_24px_rgba(45,91,255,0.35)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Utility Cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-highest/10 px-3 py-1.5 rounded-full border border-surface-variant/20">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
          <span className="text-xs text-surface-container-lowest font-bold">Nigeria 🇳🇬 (NGN)</span>
        </div>

        {/* Track Order Quick Action */}
        <Link
          href={`${prefix}/track-order`}
          className="hidden sm:flex items-center gap-1.5 bg-surface-container-highest/10 hover:bg-surface-container-highest/20 text-surface-container-lowest font-bold text-xs px-3 py-1.5 rounded-full border border-surface-variant/20 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">search</span>
          <span>Track order</span>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-surface-container-lowest md:hidden p-2 rounded-lg hover:bg-surface-container-highest/20 transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-on-background border-b border-surface-variant/20 p-5 md:hidden shadow-2xl flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-surface-container-lowest py-2 border-b border-surface-variant/10 flex items-center justify-between"
            >
              <span>{link.label}</span>
              <span className="material-symbols-outlined text-sm text-outline-variant">chevron_right</span>
            </Link>
          ))}
          <div className="pt-2 flex items-center justify-between text-xs text-outline-variant">
            <span>Currency: Nigeria 🇳🇬 (NGN)</span>
            <span className="text-secondary-container font-bold">Paystack Instant</span>
          </div>
        </div>
      )}
    </header>
  );
}
