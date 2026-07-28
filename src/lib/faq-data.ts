import { SITE } from "./site";

export type FaqItem = { q: string; a: string };

/** 메인 SEO·AEO용 자주 묻는 질문 */
export const HOME_FAQS: FaqItem[] = [
  {
    q: "골든두들은 어떤 견종인가요?",
    a: "골든두들은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견입니다. 리트리버의 온화한 성향과 푸들의 영리함·코트 특성이 조화를 이루며, 골든두들분양에서 가장 많이 찾는 두들 계열입니다.",
  },
  {
    q: "골든두들분양가·비용은 얼마인가요?",
    a: "골든두들비용과 분양가격은 크기(미니·미디엄·스탠다드), 세대, 코트·컬러, 건강 검사 여부에 따라 달라집니다. 정확한 분양가는 상담 시 현재 가능한 아이 기준으로 안내드리며, 초기 접종·용품 등 총비용도 함께 설명합니다.",
  },
  {
    q: "미니골든두들분양은 무엇이 다른가요?",
    a: "미니골든두들은 소형·미니 푸들 조합으로 체구를 줄인 타입입니다. 아파트 등 소형 주거에 적합하고, 스탠다드와 관리·운동량·분양가 측면에서 차이가 있을 수 있어 상담으로 맞는 사이즈를 추천합니다.",
  },
  {
    q: "골든두들은 털빠짐이 없나요?",
    a: "푸들 유전자 비율과 코트 타입에 따라 털빠짐이 적거나 중간일 수 있습니다. 완전 무탈모를 보장하지는 않으며, 개체별 차이를 분양 전 솔직히 안내합니다. 정기 빗질과 미용은 필요합니다.",
  },
  {
    q: "오시두들·버니두들·파티두들은 골든두들과 어떻게 다른가요?",
    a: "오시두들은 오스트레일리안 셰퍼드×푸들, 버니두들은 버니즈 마운틴 독×푸들, 파티두들은 파티컬러 마킹이 돋보이는 두들입니다. 골든두들종류마다 활동량·성격·외모가 다르므로 라이프스타일에 맞춰 상담합니다.",
  },
  {
    q: "골든두들 성격과 특징은 어떤가요?",
    a: "대체로 사람을 잘 따르고 밝으며, 가족과 함께하는 시간을 좋아합니다. 영리해 훈련에 잘 반응하고, 적절한 산책·놀이가 필요합니다. 개체·세대에 따라 기질 차이가 있어 매칭 상담이 중요합니다.",
  },
];

export function faqJsonLd(faqs: FaqItem[] = HOME_FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function orgJsonLd() {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: SITE.name,
    alternateName: SITE.nameEn,
    description: SITE.description,
    url: SITE.siteUrl,
    image: `${SITE.siteUrl}${SITE.logo}`,
    areaServed: "KR",
    knowsAbout: [
      "골든두들분양",
      "골든두들",
      "미니골든두들",
      "오시두들",
      "버니두들",
      "파티두들",
    ],
  };
  if (SITE.phone) {
    base.telephone = SITE.phone;
    base.contactPoint = [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "customer service",
        areaServed: "KR",
        availableLanguage: ["Korean"],
      },
    ];
  }
  return base;
}

/** AEO: 핵심 질문에 대한 직접 답변 블록 */
export function speakableJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "골든두들분양 | 골든두들 클럽",
    url: SITE.siteUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".aeo-answer", ".maison-faq-answer"],
    },
    mainEntity: {
      "@type": "Thing",
      name: "골든두들",
      description:
        "골든리트리버와 푸들의 이종교배로 태어난 하이브리드견. 골든두들분양, 비용, 성격, 털빠짐, 미니골든두들 및 오시두들·버니두들·파티두들 등 종류 안내.",
    },
  };
}
