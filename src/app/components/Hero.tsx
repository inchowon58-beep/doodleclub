import Image from "next/image";
import Link from "next/link";
import { SITE, phoneToTel, hasPhone } from "@/lib/site";
import { imageUrl } from "@/lib/images";

export default function Hero() {
  const kakao = SITE.kakaoUrl?.trim();
  const phoneOk = hasPhone();

  return (
    <section className="maison-hero relative min-h-[92vh] flex items-end overflow-hidden">
      <Image
        src={imageUrl(2)}
        alt="골든두들분양 골든두들 클럽"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="maison-hero-veil absolute inset-0" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 pt-32">
        <p className="maison-eyebrow text-white/80 mb-5 animate-maison-fade">
          Golden Retriever × Poodle · Hybrid Companion
        </p>
        <h1 className="maison-display text-white max-w-3xl mb-4 animate-maison-rise">
          <span className="block text-[clamp(2.4rem,7vw,4.6rem)] leading-[1.05] font-normal">
            Golden Doodle Club
          </span>
          <span className="block mt-3 text-[clamp(1.35rem,3.2vw,2rem)] font-light tracking-wide text-white/95">
            골든두들분양
          </span>
        </h1>
        <p className="aeo-answer max-w-xl text-sm sm:text-base text-white/85 leading-relaxed mb-10 animate-maison-rise-delay">
          골든리트리버와 푸들의 이종교배로 태어난 하이브리드견.
          <br className="hidden sm:block" />
          비용·성격·털빠짐·종류까지 — 골든두들 클럽이 안내합니다.
        </p>
        <div className="flex flex-wrap gap-3 animate-maison-rise-delay-2">
          <Link href="/#breed" className="maison-btn-light">
            Discover the Breed
          </Link>
          {kakao ? (
            <a href={kakao} target="_blank" rel="noopener noreferrer" className="maison-btn-ghost">
              카톡문의
            </a>
          ) : (
            <Link href="/#contact" className="maison-btn-ghost">
              Private Inquiry
            </Link>
          )}
          {phoneOk && (
            <a href={phoneToTel()} className="maison-btn-ghost">
              {SITE.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
