import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, CTA_LABEL, siteOgImageUrl } from "@/lib/site";
import { listPages, readPage } from "@/lib/seo-pages";
import { galleryAlt } from "@/lib/images";
import { faqJsonLd } from "@/lib/faq-data";
import GuideHeroThumb from "@/app/components/GuideHeroThumb";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await listPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const page = await readPage(slug);
  if (!page) return { title: "페이지 없음" };
  const base = SITE.siteUrl.replace(/\/$/, "");
  const url = `${base}/guide/${encodeURIComponent(page.slug)}`;
  // 네이버는 webp·동적 OG 경로를 잘 못 읽는 경우가 많아 정적 JPG를 1순위로 사용
  const ogImage = siteOgImageUrl();
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.metaKeywords.split(",").map((s) => s.trim()),
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      siteName: SITE.name,
      locale: "ko_KR",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: galleryAlt(page.keyword, 1),
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const page = await readPage(slug);
  if (!page) notFound();

  const pageUrl = `${SITE.siteUrl.replace(/\/$/, "")}/guide/${encodeURIComponent(page.slug)}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE.siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "골든두들 안내글",
        item: `${SITE.siteUrl.replace(/\/$/, "")}/#articles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.h1,
        item: pageUrl,
      },
    ],
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    keywords: page.metaKeywords,
    datePublished: page.createdAt,
    dateModified: page.updatedAt,
    author: { "@type": "Organization", name: SITE.brand },
    publisher: {
      "@type": "Organization",
      name: SITE.brand,
      logo: { "@type": "ImageObject", url: `${SITE.siteUrl}${SITE.logo}` },
    },
    image: page.images,
    mainEntityOfPage: pageUrl,
  };

  const images = page.images || [];
  const [missionSection, facilitySection, relatedSection] = page.sections || [];
  const otherSections = page.sections?.slice(3) || [];

  return (
    <article className="pb-8 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(page.faqs)) }}
      />

      {/* ---------- Hero ---------- */}
      <div className="maison-section maison-section-mist px-4 pb-10 pt-8">
        <div className="max-w-6xl mx-auto">
          <GuideHeroThumb page={page} imageSrc={images[0] || SITE.logo} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <nav className="mb-6 text-sm text-[var(--maison-muted)]">
          <Link href="/" className="hover:text-[var(--maison-gold)]">
            홈
          </Link>
          <span className="mx-2">/</span>
          <Link href="/#articles" className="hover:text-[var(--maison-gold)]">
            골든두들 안내글
          </Link>
          <span className="mx-2">/</span>
          <span>{page.keyword}</span>
        </nav>

        <h1 className="maison-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-snug text-[var(--maison-ink)] mb-2">
          {page.h1}
        </h1>
        {page.heroSubtitle && (
          <p className="mb-10 text-sm font-medium text-[var(--maison-muted)]">
            {page.heroSubtitle}
          </p>
        )}
      </div>

      {/* ---------- 소개 / 미션 ---------- */}
      {missionSection && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="maison-eyebrow mb-3">About</p>
          <h2 className="maison-display text-[clamp(1.35rem,3vw,1.85rem)] text-[var(--maison-ink)] mb-5">
            {missionSection.h2}
          </h2>
          {missionSection.paragraphs.map((p, pi) => (
            <p key={pi} className="mb-4 leading-relaxed text-[var(--maison-muted)]">
              {p}
            </p>
          ))}
          {images[1] && (
            <figure className="my-6 overflow-hidden rounded-[1.75rem]">
              <Image
                src={images[1]}
                alt={galleryAlt(page.keyword, 2)}
                width={1000}
                height={700}
                className="w-full object-cover"
                loading="lazy"
              />
            </figure>
          )}
        </section>
      )}

      {/* ---------- 핵심 서비스 6가지 ---------- */}
      {page.services && page.services.length > 0 && (
        <section className="maison-section maison-section-mist mt-12 md:mt-16 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <details className="group">
              <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
                <div className="text-center mb-4">
                  <p className="maison-eyebrow mb-3">Service</p>
                  <h2 className="maison-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-[var(--maison-ink)] mb-3">
                    {page.servicesTitle || `${SITE.brand}의 핵심 서비스`}
                  </h2>
                  {page.servicesIntro && (
                    <p className="text-[var(--maison-muted)] max-w-2xl mx-auto">
                      {page.servicesIntro}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-[var(--maison-gold)]">
                    클릭하여 자세히 보기
                    <span className="inline-block ml-1 transition group-open:rotate-180" aria-hidden>
                      ▾
                    </span>
                  </p>
                </div>
              </summary>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.services.map((svc, i) => (
                  <article
                    key={svc.title + i}
                    className="maison-soft-block rounded-[1.75rem] overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={images[i % Math.max(images.length, 1)] || SITE.logo}
                        alt={svc.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-[var(--maison-ink)]/80 px-3 py-1 text-[10px] tracking-wider text-white">
                        STEP {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6">
                      <h3 className="text-[var(--maison-ink)] font-medium mb-2">{svc.title}</h3>
                      <p className="text-sm text-[var(--maison-muted)] leading-relaxed">
                        {svc.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </details>
          </div>
        </section>
      )}

      {/* ---------- 케어 안내 ---------- */}
      {facilitySection && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 md:mt-16">
          <p className="maison-eyebrow mb-3">Care</p>
          <h2 className="maison-display text-[clamp(1.35rem,3vw,1.85rem)] text-[var(--maison-ink)] mb-5">
            {facilitySection.h2}
          </h2>
          {facilitySection.paragraphs.map((p, pi) => (
            <p key={pi} className="mb-4 leading-relaxed text-[var(--maison-muted)]">
              {p}
            </p>
          ))}
          {images[2] && (
            <figure className="my-6 overflow-hidden rounded-[1.75rem]">
              <Image
                src={images[2]}
                alt={galleryAlt(page.keyword, 3)}
                width={1000}
                height={700}
                className="w-full object-cover"
                loading="lazy"
              />
            </figure>
          )}
        </section>
      )}

      {/* ---------- 세 가지 약속 ---------- */}
      {page.promises && page.promises.length > 0 && (
        <section className="maison-section py-16 lg:py-20 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="maison-eyebrow mb-3">Promise</p>
              <h2 className="maison-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-[var(--maison-ink)]">
                {page.promisesTitle || `${SITE.brand}의 세 가지 약속`}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {page.promises.map((pr, i) => (
                <div
                  key={pr.title + i}
                  className="maison-soft-block rounded-[1.75rem] p-6 sm:p-8 text-center"
                >
                  <span className="maison-display text-2xl text-[var(--maison-gold)] block mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[var(--maison-ink)] font-medium mb-2">{pr.title}</p>
                  <p className="text-sm text-[var(--maison-muted)] leading-relaxed">
                    {pr.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- 4단계 절차 ---------- */}
      {page.processSteps && page.processSteps.length > 0 && (
        <section className="maison-section maison-section-mist py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="maison-eyebrow mb-3">Process</p>
              <h2 className="maison-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-[var(--maison-ink)]">
                {page.processTitle || `${page.keyword} 진행 4단계`}
              </h2>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {page.processSteps.map((step) => (
                <li
                  key={step.step}
                  className="maison-soft-block rounded-[1.75rem] p-6 sm:p-7"
                >
                  <span className="maison-display text-xl text-[var(--maison-gold)] block mb-3">
                    {step.step}
                  </span>
                  <h3 className="text-[var(--maison-ink)] font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--maison-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- 관련 검색 의도 ---------- */}
      {(relatedSection || (page.relatedIntents && page.relatedIntents.length > 0)) && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 md:mt-16">
          {relatedSection && (
            <>
              <p className="maison-eyebrow mb-3">Related</p>
              <h2 className="maison-display text-[clamp(1.35rem,3vw,1.85rem)] text-[var(--maison-ink)] mb-5">
                {relatedSection.h2}
              </h2>
              {relatedSection.paragraphs.map((p, pi) => (
                <p key={pi} className="mb-4 leading-relaxed text-[var(--maison-muted)]">
                  {p}
                </p>
              ))}
            </>
          )}
          {page.relatedIntents && page.relatedIntents.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {page.relatedIntents.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-[var(--maison-line)] bg-[var(--maison-card)] px-4 py-1.5 text-sm font-medium text-[var(--maison-muted)]"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 하위 호환: 추가 sections */}
      {otherSections.map((sec, si) => (
        <section key={sec.h2 + si} className="max-w-3xl mx-auto px-4 sm:px-6 mt-12">
          <h2 className="maison-display text-[clamp(1.35rem,3vw,1.85rem)] text-[var(--maison-ink)] mb-5">
            {sec.h2}
          </h2>
          {sec.paragraphs.map((p, pi) => (
            <p key={pi} className="mb-4 leading-relaxed text-[var(--maison-muted)]">
              {p}
            </p>
          ))}
        </section>
      ))}

      {/* ---------- FAQ ---------- */}
      {page.faqs?.length > 0 && (
        <section className="maison-section py-16 lg:py-20 mt-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="maison-eyebrow mb-3">FAQ</p>
              <h2 className="maison-display text-[clamp(1.5rem,3.5vw,2.2rem)] text-[var(--maison-ink)]">
                자주 묻는 질문
              </h2>
            </div>
            <div className="space-y-3">
              {page.faqs.map((f, i) => (
                <details
                  key={f.q + i}
                  className="maison-soft-block rounded-[1.25rem] px-5 sm:px-6 py-4 group"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-[var(--maison-ink)] font-medium [&::-webkit-details-marker]:hidden">
                    <span>{f.q}</span>
                    <span className="text-[var(--maison-gold)] shrink-0 group-open:rotate-45 transition">
                      +
                    </span>
                  </summary>
                  <p className="maison-faq-answer aeo-answer mt-3 text-sm text-[var(--maison-muted)] leading-relaxed pb-1">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 mb-16">
        <aside className="maison-soft-block rounded-[2rem] p-8 sm:p-10 flex flex-col items-center gap-5 text-center">
          <p className="maison-eyebrow">Contact — 골든두들분양</p>
          <p className="maison-display text-xl md:text-2xl text-[var(--maison-ink)]">
            {page.ctaText}
          </p>
          {SITE.phoneTel ? (
            <a href={SITE.phoneTel} className="maison-btn-soft">
              {CTA_LABEL} {SITE.phone}
            </a>
          ) : (
            <Link href="/#contact" className="maison-btn-soft">
              {CTA_LABEL}
            </Link>
          )}
        </aside>
      </div>
    </article>
  );
}
