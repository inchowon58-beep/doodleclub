import { SIZE_FACTS } from "@/lib/club-content";

export default function Traits() {
  return (
    <section id="traits" className="maison-section py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="maison-eyebrow mb-4">Size & Character</p>
          <h2 className="maison-display text-[clamp(1.75rem,4vw,2.6rem)] text-[var(--maison-ink)] mb-4">
            특징과 성격
          </h2>
          <p className="text-[var(--maison-muted)] leading-relaxed">
            활발하면서도 사람을 잘 따르는 컴패니언. 골든두들의 크기와 기질을 알아보세요.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {SIZE_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="maison-soft-block text-center px-4 py-8 rounded-[1.75rem]"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--maison-gold)] mb-3">
                {fact.label}
              </p>
              <p className="maison-display text-xl sm:text-2xl text-[var(--maison-ink)] mb-2">
                {fact.value}
              </p>
              <p className="text-xs text-[var(--maison-muted)]">{fact.note}</p>
            </div>
          ))}
        </div>

        <div className="maison-soft-block rounded-[2rem] p-8 sm:p-12 max-w-4xl mx-auto">
          <p className="maison-eyebrow mb-3">Temperament</p>
          <h3 className="maison-display text-2xl text-[var(--maison-ink)] mb-5">
            사람을 향한 밝은 충성
          </h3>
          <div className="aeo-answer space-y-4 text-[var(--maison-muted)] leading-relaxed">
            <p>
              골든두들은 대체로 밝고 애교 많으며, 가족을 자신의 무리로 여기는 성향이 강합니다.
              골든리트리버의 친화력과 푸들의 영리함이 더해져, 기초 훈련과 사회화에 잘 반응합니다.
            </p>
            <p>
              에너지가 중~높은 편이므로 산책과 놀이를 즐기는 가정에 잘 맞습니다. 개체·세대에 따라
              기질 차이가 있어, 골든두들 클럽은 생활 환경에 맞는 아이를 상담으로 매칭합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
