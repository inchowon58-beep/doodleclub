/** 골든두들 클럽 — 골든두들분양 사이트 공통 설정 (단독 프로젝트) */

const phoneRaw = (process.env.NEXT_PUBLIC_PHONE || "0505-464-1004").trim();

export const SITE = {
  name: "골든두들 클럽",
  nameEn: "Golden Doodle Club",
  brand: "골든두들 클럽",
  brandEn: "Golden Doodle Club",
  tagline: "골든리트리버 × 푸들 하이브리드, 골든두들분양",
  taglineEn: "Goldendoodle Adoption · Retriever × Poodle Hybrid",
  description:
    "골든두들 클럽은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견 골든두들분양을 안내합니다. 골든두들비용·분양가·가격·특징·성격·털빠짐·미니골든두들분양과 오시두들·버니두들·파티두들 등 두들 종류까지 자세히 알려드립니다.",
  keywords: [
    "골든두들분양",
    "골든두들",
    "골든두들비용",
    "분양가",
    "가격",
    "분양가격",
    "미니골든두들분양",
    "골든두들종류",
    "오시두들",
    "버니두들",
    "파티두들",
    "골든두들특징",
    "골든두들성격",
    "골든두들털빠짐",
    "골든리트리버",
    "푸들",
    "하이브리드견",
    "골든두들클럽",
  ],
  /** Vercel/로컬: NEXT_PUBLIC_PHONE 로 등록 (다른 사이트 번호와 공유 금지) */
  phone: phoneRaw,
  phoneTel: phoneRaw ? `tel:${phoneRaw.replace(/\D/g, "")}` : "",
  kakaoUrl: (process.env.NEXT_PUBLIC_KAKAO_URL || "").trim(),
  email: "",
  address: "",
  logo: "/logo.png",
  /** 네이버·카카오 등 OG용 정적 이미지 (webp/동적 경로 회피) */
  ogImagePath: "/og.jpg",
  imageBase: "https://image.cattery.co.kr/doodle",
  imageCount: 40,
  areaServed: "대한민국 전국",
  /** 커스텀 도메인 연결 후 NEXT_PUBLIC_SITE_URL 을 그 주소로 교체 */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://namhae.puppytimes.co.kr",
} as const;

export const CTA_LABEL = "분양 상담";
export const CTA_LABEL_CALL = "전화문의";

export function absoluteUrl(path: string): string {
  const base = SITE.siteUrl.replace(/\/$/, "");
  if (!path) return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function siteOgImageUrl(): string {
  return absoluteUrl(SITE.ogImagePath);
}

export function phoneToTel(phone: string = SITE.phone): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:${digits}` : "#contact";
}

export function hasPhone(): boolean {
  return Boolean(SITE.phone && SITE.phone.replace(/\D/g, "").length >= 8);
}
