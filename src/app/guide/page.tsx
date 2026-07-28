import type { Metadata } from "next";
import Link from "next/link";
import { listPages, pagePath } from "@/lib/seo-pages";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "골든두들 안내글",
  description: `${SITE.brand} 골든두들분양·미니골든두들·두들 종류 안내글 모음`,
  alternates: { canonical: `${SITE.siteUrl}/guide` },
};

const PAGE_SIZE = 20;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function GuideIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const all = await listPages();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const current = Math.min(pageNum, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);

  return (
    <div className="maison-section min-h-screen py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="maison-eyebrow mb-4">Guides</p>
        <h1 className="maison-display text-[clamp(1.75rem,4vw,2.6rem)] text-[var(--maison-ink)]">
          골든두들 안내글
        </h1>
        <p className="mt-3 text-[var(--maison-muted)]">
          총 {total}건 · 페이지당 {PAGE_SIZE}개 · {SITE.brand} 골든두들분양 가이드
        </p>

        <ul className="mt-10 space-y-3">
          {slice.length === 0 && (
            <li className="maison-soft-block rounded-[1.5rem] px-5 py-8 text-[var(--maison-muted)]">
              등록된 안내글이 없습니다.
            </li>
          )}
          {slice.map((p, i) => {
            const no = start + i + 1;
            return (
              <li key={p.slug}>
                <Link
                  href={pagePath(p.slug)}
                  className="maison-soft-block flex gap-5 sm:gap-8 p-5 sm:p-6 rounded-[1.5rem] hover:border-[var(--maison-gold)]/40 transition"
                >
                  <span className="maison-display text-xl text-[var(--maison-gold)] shrink-0">
                    {String(no).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--maison-gold)]">
                      {p.keyword}
                    </span>
                    <h2 className="text-base sm:text-lg text-[var(--maison-ink)] font-medium mt-1 mb-1">
                      {p.h1}
                    </h2>
                    <p className="text-sm text-[var(--maison-muted)] line-clamp-2">
                      {p.metaDescription}
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
                href={current - 1 === 1 ? "/guide" : `/guide?page=${current - 1}`}
                className="min-w-10 rounded-full border border-[var(--maison-line)] bg-[var(--maison-card)] px-3 py-2 text-center text-sm font-semibold text-[var(--maison-ink)]"
              >
                이전
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={n === 1 ? "/guide" : `/guide?page=${n}`}
                className={`min-w-10 rounded-full px-3 py-2 text-center text-sm font-semibold ${
                  n === current
                    ? "bg-[var(--maison-ink)] text-white"
                    : "border border-[var(--maison-line)] bg-[var(--maison-card)] text-[var(--maison-ink)]"
                }`}
              >
                {n}
              </Link>
            ))}
            {current < totalPages && (
              <Link
                href={`/guide?page=${current + 1}`}
                className="min-w-10 rounded-full border border-[var(--maison-line)] bg-[var(--maison-card)] px-3 py-2 text-center text-sm font-semibold text-[var(--maison-ink)]"
              >
                다음
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
