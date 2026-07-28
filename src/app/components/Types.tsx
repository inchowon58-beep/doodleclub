import { DOODLE_TYPES } from "@/lib/club-content";

export default function Types() {
  return (
    <section id="types" className="maison-section maison-section-mist py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="maison-eyebrow mb-4">Doodle Types</p>
          <h2 className="maison-display text-[clamp(1.75rem,4vw,2.6rem)] text-[var(--maison-ink)] mb-4">
            골든두들종류와 두들 패밀리
          </h2>
          <p className="aeo-answer text-[var(--maison-muted)] leading-relaxed">
            골든두들·미니골든두들분양부터 오시두들·버니두들·파티두들까지.
            푸들 기반 하이브리드의 성격과 외모 차이를 한눈에 비교해 보세요.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DOODLE_TYPES.map((item) => (
            <article key={item.en} className="maison-soft-block p-6 sm:p-8 rounded-[1.75rem]">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--maison-gold)] mb-2">
                {item.en}
              </p>
              <h3 className="maison-display text-xl text-[var(--maison-ink)] mb-3">{item.ko}</h3>
              <p className="text-sm text-[var(--maison-muted)] leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
