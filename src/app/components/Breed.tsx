import Image from "next/image";
import { imageUrl } from "@/lib/images";
import { BREED_TRAITS } from "@/lib/club-content";

export default function Breed() {
  return (
    <section id="breed" className="maison-section py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="maison-media relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src={imageUrl(6)}
                alt="골든두들 품종 소개"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <p className="maison-eyebrow mb-4">The Breed</p>
            <h2 className="maison-display text-[clamp(1.75rem,4vw,2.75rem)] text-[var(--maison-ink)] mb-5 leading-snug">
              골든두들,
              <br />
              <em className="not-italic text-[var(--maison-gold)]">Goldendoodle</em>
            </h2>
            <p className="aeo-answer text-[var(--maison-muted)] leading-relaxed mb-10 max-w-xl">
              골든두들은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견입니다.
              사람을 향한 온화한 성격과 다양한 코트, 미니부터 스탠다드까지 폭넓은 사이즈로
              전 세계 가정에서 사랑받고 있습니다. 골든두들 클럽은 이 품종의 본질을 지키며
              분양을 안내합니다.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {BREED_TRAITS.map((item) => (
                <article key={item.en} className="maison-soft-block p-5 sm:p-6">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--maison-gold)] mb-2">
                    {item.en}
                  </p>
                  <h3 className="text-base text-[var(--maison-ink)] mb-2 font-medium">{item.ko}</h3>
                  <p className="text-sm text-[var(--maison-muted)] leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
