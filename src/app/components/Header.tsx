"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE, phoneToTel, hasPhone } from "@/lib/site";
import { CLUB_NAV } from "@/lib/club-content";

export default function Header() {
  const [open, setOpen] = useState(false);
  const kakao = SITE.kakaoUrl?.trim();
  const phoneOk = hasPhone();

  return (
    <header className="maison-header sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
          <Link href="/" className="group min-w-0">
            <span className="block text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-[var(--maison-gold)]">
              Golden Doodle Club
            </span>
            <span className="block text-lg sm:text-xl font-medium text-[var(--maison-ink)] tracking-tight truncate">
              {SITE.brand}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {CLUB_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] tracking-[0.22em] uppercase text-[var(--maison-muted)] hover:text-[var(--maison-ink)] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {phoneOk && (
              <a
                href={phoneToTel()}
                className="text-sm text-[var(--maison-ink)] hover:text-[var(--maison-gold)] transition"
              >
                {SITE.phone}
              </a>
            )}
            {kakao && (
              <a
                href={kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="maison-btn-soft text-xs tracking-wide"
              >
                Kakao
              </a>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden p-2.5 rounded-full text-[var(--maison-ink)] hover:bg-[var(--maison-mist)] transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴"
          >
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-3.5 h-px bg-current ml-auto" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--maison-line)] bg-[var(--maison-pearl)]/98 backdrop-blur-md px-4 py-5 space-y-1">
          {CLUB_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2.5 text-sm text-[var(--maison-ink)]"
              onClick={() => setOpen(false)}
            >
              <span className="tracking-[0.18em] uppercase text-xs text-[var(--maison-muted)] mr-2">
                {item.label}
              </span>
            </Link>
          ))}
          {phoneOk && (
            <a href={phoneToTel()} className="block py-2.5 text-sm font-medium text-[var(--maison-ink)]">
              {SITE.phone}
            </a>
          )}
        </div>
      )}
    </header>
  );
}
