import Image from "next/image";
import type { SeoPage } from "@/lib/seo-pages";
import { galleryAlt } from "@/lib/images";
import { SITE } from "@/lib/site";

type Props = {
  page: SeoPage;
  imageSrc: string;
};

/** 안내글 상단 히어로 — Maison 톤 */
export default function GuideHeroThumb({ page, imageSrc }: Props) {
  const badge = page.heroBadge || `골든두들분양 · ${SITE.brand}`;
  const line1 = page.heroTitleLine1 || page.keyword;
  const line2 = page.heroTitleLine2 || "우리 집에 맞는 두들을 만나세요";
  const bar = page.heroBar || page.heroSubtitle || "골든두들분양 · 사이즈·코트·비용 상담";

  return (
    <div className="maison-media relative mx-auto aspect-[5/4] w-full max-w-[720px] overflow-hidden rounded-[2rem]">
      <Image
        src={imageSrc}
        alt={galleryAlt(page.keyword, 1)}
        fill
        priority
        className="object-cover"
        sizes="(max-width:768px) 100vw, 720px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,22,18,0.75)] via-[rgba(28,22,18,0.35)] to-[rgba(28,22,18,0.2)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 text-center">
        <span className="maison-eyebrow text-[var(--maison-gold-soft)]">{badge}</span>

        <h1 className="maison-display mt-4 max-w-[18ch] text-[clamp(1.85rem,5vw,3rem)] leading-[1.15] text-white">
          <span className="block">{line1}</span>
          <span className="mt-2 block text-[clamp(1.1rem,2.5vw,1.5rem)] font-light text-white/90">
            {line2}
          </span>
        </h1>

        <p className="mt-5 max-w-md text-sm text-white/75 leading-relaxed">{bar}</p>
      </div>
    </div>
  );
}
