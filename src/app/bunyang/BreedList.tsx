import Link from "next/link";
import {
  breedPath,
  BREED_PHONE,
  brandFor,
  isShelterIntent,
  type BreedEntry,
} from "@/lib/breed-catalog";

const PAGE_SIZE = 20;

type Props = {
  title: string;
  lead: string;
  basePath: "/bunyang" | "/goyang";
  all: BreedEntry[];
  pageNum: number;
};

export default function BreedList({ title, lead, basePath, all, pageNum }: Props) {
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const current = Math.min(pageNum, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);
  const brand = brandFor(basePath === "/goyang" ? "cat" : "dog");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen py-28">
      <p className="maison-eyebrow mb-3">Adoption</p>
      <p className="text-sm text-[var(--maison-gold)] mb-2">{brand}</p>
      <h1 className="maison-display text-[clamp(1.75rem,4vw,2.5rem)] text-[var(--maison-ink)] mb-3">
        {title}
      </h1>
      <p className="text-[var(--maison-muted)] max-w-2xl">
        총 {total.toLocaleString()}건 · 페이지당 {PAGE_SIZE}개 · {lead} · 상담{" "}
        {BREED_PHONE}
      </p>

      <ul className="mt-10 divide-y divide-[var(--maison-line)] border border-[var(--maison-line)] bg-[var(--maison-card)] rounded-[1.75rem] overflow-hidden">
        {slice.map((p, i) => {
          const no = start + i + 1;
          return (
            <li key={p.slug}>
              <Link
                href={breedPath(p)}
                className="flex gap-4 px-5 py-4 transition hover:bg-[var(--maison-mist)]"
              >
                <span className="w-10 shrink-0 maison-display text-xl text-[var(--maison-gold)]">
                  {String(no).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-xs text-[var(--maison-gold)]">{p.def.label}</div>
                  <div className="maison-display text-xl text-[var(--maison-ink)]">
                    {p.keyword}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--maison-muted)]">
                    {isShelterIntent(p.intent)
                      ? p.region
                        ? `${p.region} 파양입소·무료분양 상담`
                        : "전국 파양입소·무료분양 상담"
                      : p.region
                        ? `${p.region} ${p.def.label} 펫샵 분양 상담`
                        : `전국 ${p.def.label} 펫샵 분양 상담`}{" "}
                    · {BREED_PHONE}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav
          className="mt-10 mb-8 flex flex-wrap items-center justify-center gap-2 pb-8"
          aria-label="페이지"
        >
          {current > 1 && (
            <Link
              href={
                current - 1 === 1 ? basePath : `${basePath}?page=${current - 1}`
              }
              className="min-w-10 rounded-full border border-[var(--maison-line)] bg-white px-3 py-2 text-center text-sm font-semibold text-[var(--maison-ink)]"
            >
              이전
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => {
              if (totalPages <= 12) return true;
              if (n === 1 || n === totalPages) return true;
              return Math.abs(n - current) <= 3;
            })
            .map((n, idx, arr) => {
              const prev = arr[idx - 1];
              const gap = prev && n - prev > 1;
              return (
                <span key={n} className="contents">
                  {gap && (
                    <span className="px-1 text-[var(--maison-muted)]" aria-hidden>
                      …
                    </span>
                  )}
                  <Link
                    href={n === 1 ? basePath : `${basePath}?page=${n}`}
                    className={`min-w-10 rounded-full px-3 py-2 text-center text-sm font-semibold ${
                      n === current
                        ? "bg-[var(--maison-ink)] text-white"
                        : "border border-[var(--maison-line)] bg-white text-[var(--maison-ink)]"
                    }`}
                  >
                    {n}
                  </Link>
                </span>
              );
            })}
          {current < totalPages && (
            <Link
              href={`${basePath}?page=${current + 1}`}
              className="min-w-10 rounded-full border border-[var(--maison-line)] bg-white px-3 py-2 text-center text-sm font-semibold text-[var(--maison-ink)]"
            >
              다음
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
