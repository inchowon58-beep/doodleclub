"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, phoneToTel, hasPhone } from "@/lib/site";
import { CLUB_NAV } from "@/lib/club-content";
import {
  DOG_BRAND,
  CAT_BRAND,
  BREED_PHONE,
  BREED_PHONE_TEL,
  SHELTER_CTA_LABEL,
  isShelterPath,
} from "@/lib/breed-catalog";

export default function Footer() {
  const pathname = usePathname() || "";
  const isDog = pathname.startsWith("/bunyang");
  const isCat = pathname.startsWith("/goyang");
  const isBreed = isDog || isCat;
  const shelter = isShelterPath(pathname);
  const brandLabel = isDog ? DOG_BRAND : isCat ? CAT_BRAND : SITE.brand;
  const brandEn = isDog
    ? "Dog Adoption Club"
    : isCat
      ? "Cat Adoption Club"
      : "Golden Doodle Club";
  const phoneLabel = shelter
    ? SHELTER_CTA_LABEL
    : isBreed
      ? BREED_PHONE
      : SITE.phone;
  const phoneHref = isBreed ? BREED_PHONE_TEL : phoneToTel();
  const kakao = SITE.kakaoUrl?.trim();
  const phoneOk = isBreed || hasPhone();
  const blurb = shelter
    ? "개인 사정 파양입소와 무료분양 매칭을 안내합니다."
    : isDog
      ? "강아지분양·무료분양·애견분양, 펫샵·애견샵 상담을 안내합니다."
      : isCat
        ? "고양이분양·무료분양, 펫샵 상담을 안내합니다."
        : "골든두들분양, 비용·성격·털빠짐·종류 상담 — 편안하게 말씀해 주세요.";

  return (
    <footer id="contact" className="maison-footer pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 mb-14">
          <div>
            <p className="maison-eyebrow text-[var(--maison-gold-soft)] mb-3">Contact</p>
            <h2 className="maison-display text-3xl sm:text-4xl text-white mb-2">
              {brandEn}
            </h2>
            <p className="text-white/70 text-lg mb-6">{brandLabel}</p>
            <p className="text-white/55 leading-relaxed max-w-md mb-8">{blurb}</p>

            <div className="flex flex-wrap gap-3">
              {kakao && (
                <a
                  href={kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="maison-btn-light"
                >
                  카톡문의
                </a>
              )}
              {phoneOk && (
                <a href={phoneHref} className="maison-btn-ghost">
                  {phoneLabel}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10">
            <nav className="flex flex-wrap gap-x-6 gap-y-3">
              {CLUB_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs tracking-[0.2em] uppercase text-white/45 hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="rounded-[1.75rem] bg-white/5 border border-white/10 p-6 sm:p-8 space-y-3">
              {phoneOk && (
                <p className="text-sm text-white/80">
                  <span className="text-white/40 text-xs tracking-[0.2em] uppercase mr-3">
                    Phone
                  </span>
                  {phoneLabel}
                </p>
              )}
              {SITE.address && (
                <p className="text-sm text-white/60">
                  <span className="text-white/40 text-xs tracking-[0.2em] uppercase mr-3">
                    Address
                  </span>
                  {SITE.address}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} {brandLabel}. All rights reserved.
          </p>
          <Link href="/admin" className="text-xs text-white/25 hover:text-white/50 transition">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
