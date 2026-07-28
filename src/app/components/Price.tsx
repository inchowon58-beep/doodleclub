import { PRICE_POINTS } from "@/lib/club-content";
import { SITE, phoneToTel, hasPhone } from "@/lib/site";
import Link from "next/link";

export default function Price() {
  const phoneOk = hasPhone();
  return (
    <section id="price" className="maison-section maison-section-mist py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="maison-eyebrow mb-4">Cost & Price</p>
          <h2 className="maison-display text-[clamp(1.75rem,4vw,2.6rem)] text-[var(--maison-ink)] mb-4">
            골든두들비용 · 분양가 · 가격
          </h2>
          <p className="aeo-answer text-[var(--maison-muted)] leading-relaxed">
            분양가격은 크기·세대·코트·건강 검사에 따라 달라집니다.
            정확한 견적은 상담으로 현재 가능한 아이 기준으로 안내합니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-10">
          {PRICE_POINTS.map((item) => (
            <article key={item.en} className="maison-soft-block p-6 sm:p-8 rounded-[1.75rem]">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--maison-gold)] mb-2">
                {item.en}
              </p>
              <h3 className="text-lg text-[var(--maison-ink)] font-medium mb-3">{item.ko}</h3>
              <p className="text-sm text-[var(--maison-muted)] leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {phoneOk ? (
            <a href={phoneToTel()} className="maison-btn-soft">
              분양가 상담 {SITE.phone}
            </a>
          ) : (
            <Link href="/#contact" className="maison-btn-soft">
              분양가 상담
            </Link>
          )}
          <Link href="/#contact" className="maison-btn-light border border-[var(--maison-line)]">
            문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}
