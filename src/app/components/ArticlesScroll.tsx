import Link from "next/link";
import type { SeoPage } from "@/lib/seo-pages";
import { pagePath } from "@/lib/seo-pages";

const MAIN_PREVIEW = 5;

export default function ArticlesScroll({ pages }: { pages: SeoPage[] }) {
  const preview = pages.slice(0, MAIN_PREVIEW);

  return (
    <section id="articles" className="maison-section maison-section-mist py-20 lg:py-28 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="maison-eyebrow mb-4">Guides</p>
            <h2 className="maison-display text-[clamp(1.75rem,4vw,2.6rem)] text-[var(--maison-ink)]">
              <Link href="/guide" className="hover:text-[var(--maison-gold)] transition">
                골든두들 안내글
              </Link>
            </h2>
            {!preview.length && (
              <p className="mt-3 text-[var(--maison-muted)]">발행된 안내 글이 여기에 노출됩니다.</p>
            )}
          </div>
          {preview.length > 0 && (
            <Link
              href="/guide"
              className="text-sm text-[var(--maison-gold)] hover:text-[var(--maison-ink)] transition"
            >
              전체 목록 보기 →
            </Link>
          )}
        </div>

        {preview.length > 0 && (
          <div className="space-y-3">
            {preview.map((p, i) => (
              <Link
                key={p.slug}
                href={pagePath(p.slug)}
                className="maison-soft-block flex gap-5 sm:gap-8 p-5 sm:p-6 rounded-[1.5rem] hover:border-[var(--maison-gold)]/40 transition"
              >
                <span className="maison-display text-xl text-[var(--maison-gold)] shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--maison-gold)]">
                    {p.keyword}
                  </span>
                  <h3 className="text-base sm:text-lg text-[var(--maison-ink)] font-medium mt-1 mb-1">
                    {p.h1}
                  </h3>
                  <p className="text-sm text-[var(--maison-muted)] line-clamp-2">
                    {p.metaDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
