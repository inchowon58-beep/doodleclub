import { HOME_FAQS } from "@/lib/faq-data";

export default function FAQ() {
  return (
    <section id="faq" className="maison-section py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="maison-eyebrow mb-4">FAQ</p>
          <h2 className="maison-display text-[clamp(1.75rem,4vw,2.6rem)] text-[var(--maison-ink)] mb-3">
            자주 묻는 질문
          </h2>
          <p className="text-[var(--maison-muted)]">
            골든두들분양 · 비용 · 성격 · 털빠짐 · 종류
          </p>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((item) => (
            <details
              key={item.q}
              className="maison-soft-block rounded-[1.25rem] px-5 sm:px-6 py-4 group"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-[var(--maison-ink)] font-medium">
                <span>{item.q}</span>
                <span className="text-[var(--maison-gold)] shrink-0 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="maison-faq-answer aeo-answer mt-3 text-sm text-[var(--maison-muted)] leading-relaxed pb-1">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
