import { SITE } from "./site";
import { pickImages } from "./images";
import type { SeoPage } from "./seo-pages";
import { slugifyKeyword } from "./seo-pages";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function hasBatchim(word: string): boolean {
  const trimmed = word.trim();
  const last = trimmed.charAt(trimmed.length - 1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function eunNeun(word: string): string {
  return hasBatchim(word) ? "은" : "는";
}
function eulReul(word: string): string {
  return hasBatchim(word) ? "을" : "를";
}
function gwaWa(word: string): string {
  return hasBatchim(word) ? "과" : "와";
}
function roEuro(word: string): string {
  const trimmed = word.trim();
  const last = trimmed.charAt(trimmed.length - 1);
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 8) return "로";
  return hasBatchim(word) ? "으로" : "로";
}

function fill(template: string, kw: string, brand: string, phone: string): string {
  return template
    .replace(/\{kw\}(는|은)/g, `${kw}${eunNeun(kw)}`)
    .replace(/\{kw\}(를|을)/g, `${kw}${eulReul(kw)}`)
    .replace(/\{kw\}(와|과)/g, `${kw}${gwaWa(kw)}`)
    .replace(/\{kw\}(로|으로)/g, `${kw}${roEuro(kw)}`)
    .replace(/\{kw\}/g, kw)
    .replace(/\{brand\}/g, brand)
    .replace(/\{phone\}/g, phone);
}

const TONE_WORDS = ["차분하게", "꼼꼼하게", "친절하게", "세심하게", "솔직하게"] as const;
const VERB_WORDS = ["안내", "상담", "설명"] as const;

const HERO_SUBTITLES = [
  "Goldendoodle Adoption · Retriever × Poodle",
  "골든리트리버와 푸들의 하이브리드",
  "Size · Coat · Temperament - {brand}",
  "골든두들비용 · 성격 · 털빠짐 안내",
  "Mini to Standard · Honest Matching",
  "미니골든두들분양 · 두들 종류 상담",
] as const;

const HERO_LINE2_POOL = [
  "우리 집에 맞는 두들을 만나세요",
  "비용부터 케어까지 함께 안내합니다",
  "성격·털빠짐·크기를 비교해 보세요",
  "정직한 분양 상담을 드립니다",
] as const;

const HERO_BADGE_POOL = [
  "골든두들분양 · {brand}",
  "하이브리드 상담 · {brand}",
  "미니~스탠다드 · {brand}",
  "전화상담 · {brand}",
] as const;

const LEAD_INS = [
  "{kw}를 알아보신다면, 크기·코트·성격부터 차분히 확인해 보세요.",
  "{kw} 검색으로 이 페이지를 찾으셨다면, 지금이 정확한 정보를 확인할 때입니다.",
  "{kw}는 가정 환경에 맞는 매칭이 중요합니다. {brand}가 함께 안내합니다.",
  "{kw} 비용과 특징이 궁금하시다면, 전화 한 통으로 현재 가능한 아이를 안내드립니다.",
] as const;

const MISSION_H2 = [
  "{kw}, {brand}가 알려드리는 핵심 안내",
  "{kw} 전 꼭 알아두면 좋은 것들",
  "{kw}, 왜 상담이 필요할까요",
  "믿을 수 있는 {kw} 안내, {brand}",
] as const;

const FACILITY_H2 = [
  "{kw}와 케어·적응 안내",
  "{brand}가 알려주는 분양 후 케어",
  "{kw} 이후 적응과 일상",
] as const;

const RELATED_H2 = [
  "{kw}와 함께 찾는 검색어",
  "{kw} 관련 키워드 모아보기",
  "{kw}만큼 자주 찾는 정보",
] as const;

const SERVICES_H2 = [
  "{brand}의 핵심 안내 6가지",
  "{kw} 상담에서 확인하는 항목",
  "{kw}와 함께 보는 {brand} 가이드",
] as const;

const PROMISE_H2 = [
  "{brand}의 세 가지 약속",
  "{kw} 상담에서 지키는 약속",
] as const;

const PROCESS_H2 = [
  "{kw} 진행 4단계",
  "{brand}와 함께하는 분양 상담 절차",
] as const;

const CTA_TEMPLATES = [
  "{kw} 상담은 전화 한 통이면 충분합니다 - {phone} · {brand}",
  "골든두들분양 상담 {phone} - {brand}",
  "{kw}, 지금 {phone}로 문의하세요 - {brand}",
] as const;

const TITLE_TEMPLATES = [
  "{kw} | {brand} 골든두들분양 안내",
  "{kw} 가이드 | {brand} - 비용·성격·털빠짐",
  "{brand} {kw} - 하이브리드 두들 상담",
] as const;

const RELATED_SUFFIXES = [
  "비용",
  "분양가",
  "가격",
  "특징",
  "성격",
  "털빠짐",
  "종류",
] as const;

const GENERIC_RELATED = [
  "골든두들분양",
  "미니골든두들분양",
  "오시두들",
  "버니두들",
  "파티두들",
  "골든두들비용",
] as const;

type ServiceDef = {
  titles: readonly string[];
  desc: (kw: string, brand: string, phone: string, tone: string) => string;
};

const SERVICE_DEFS: readonly ServiceDef[] = [
  {
    titles: ["{kw} 전화 상담", "{kw} 1:1 상담", "분양 사전 상담"],
    desc: (kw, brand, phone, tone) =>
      `${kw}를 고민 중이시라면 ${brand}가 원하시는 크기·성격·예산을 ${tone} 듣고 현재 가능한 아이를 안내합니다. 문의 ${phone}.`,
  },
  {
    titles: ["크기·세대 안내", "미니~스탠다드 비교", "사이즈 매칭"],
    desc: (kw, brand) =>
      `미니골든두들부터 미디엄·스탠다드까지 ${kw}에 맞는 체구를 비교해 드립니다. 주거 환경과 활동량에 맞춰 추천합니다.`,
  },
  {
    titles: ["코트·털빠짐 안내", "미용 주기 설명", "코트 타입 상담"],
    desc: (kw, brand, _p, tone) =>
      `직모·웨이브·컬리에 따라 털빠짐과 미용 주기가 달라집니다. ${kw} 상담 시 개체별 코트 특성을 ${tone} 설명합니다.`,
  },
  {
    titles: ["분양가·비용 견적", "투명한 가격 안내", "초기 비용 구성"],
    desc: (kw, brand) =>
      `분양가·접종·용품 등 ${kw} 관련 비용을 항목별로 안내합니다. 무리한 유도 없이 예산에 맞는 옵션을 제안합니다.`,
  },
  {
    titles: ["두들 종류 비교", "오시·버니·파티 안내", "하이브리드 비교"],
    desc: (kw) =>
      `골든두들·오시두들·버니두들·파티두들 등 ${kw}와 함께 자주 비교되는 종류를 성격·외모 기준으로 설명해 드립니다.`,
  },
  {
    titles: ["분양 후 케어", "적응 상담", "사후 안내"],
    desc: (kw, brand) =>
      `입양 후에도 식사·미용·훈련 등 적응 케어를 이어 갑니다. ${kw}${roEuro(kw)} 시작한 인연이 안정되도록 ${brand}가 돕습니다.`,
  },
];

type FaqDef = {
  questions: readonly string[];
  answer: (kw: string, brand: string, phone: string) => string;
};

const FAQ_DEFS: readonly FaqDef[] = [
  {
    questions: [
      "{kw} 상담은 어떻게 하나요?",
      "{kw} 문의 방법이 궁금해요",
    ],
    answer: (_kw, brand, phone) =>
      `${phone} 전화로 원하시는 크기·성격·예산을 알려주시면 ${brand}가 현재 가능한 아이를 안내합니다.`,
  },
  {
    questions: [
      "골든두들은 어떤 견종인가요?",
      "{kw}와 골든두들의 관계는?",
    ],
    answer: () =>
      `골든두들은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견입니다. 온화함과 영리함이 조화를 이룹니다.`,
  },
  {
    questions: [
      "분양가·비용은 얼마인가요?",
      "{kw} 가격대가 궁금해요",
    ],
    answer: (kw, brand, phone) =>
      `크기·세대·코트·건강 검사에 따라 달라집니다. ${kw} 정확한 분양가는 ${phone} 상담 시 안내드리며, ${brand}가 비용 구성도 함께 설명합니다.`,
  },
  {
    questions: [
      "털빠짐이 없나요?",
      "{kw}와 털빠짐은 어떤가요?",
    ],
    answer: () =>
      `푸들 유전자 비율과 코트에 따라 털빠짐이 적거나 중간일 수 있습니다. 완전 무탈모를 보장하지는 않으며 개체별 차이를 안내합니다.`,
  },
  {
    questions: [
      "미니골든두들분양은 무엇이 다른가요?",
      "미니와 스탠다드 차이는?",
    ],
    answer: () =>
      `미니는 체구가 작아 소형 주거에 적합합니다. 운동량·분양가·관리 측면에서 스탠다드와 차이가 있을 수 있습니다.`,
  },
  {
    questions: [
      "오시두들·버니두들·파티두들은?",
      "골든두들종류가 궁금해요",
    ],
    answer: () =>
      `오시두들은 활동적, 버니두들은 온화·대형 성향, 파티두들은 파티컬러 마킹이 특징입니다. 라이프스타일에 맞춰 상담합니다.`,
  },
  {
    questions: [
      "분양 후 케어도 해주나요?",
      "{kw} 이후 문의가 가능한가요?",
    ],
    answer: (kw, brand) =>
      `네, 적응·미용·식사 등 ${kw} 이후 궁금증도 ${brand}가 이어서 안내합니다.`,
  },
];

export function generateRegionalSeoPage(keyword: string, pageIndex = 1): SeoPage {
  const kw = keyword.trim() || "골든두들분양";
  const brand = SITE.brand;
  const phone = SITE.phone;
  const seed = hash(`${kw}|${pageIndex}|${brand}`);
  const seed2 = hash(`${kw}|${pageIndex}|v2`);
  const seed3 = hash(`${kw}|${pageIndex}|v3`);

  const tone = pick(TONE_WORDS, seed);
  const tone2 = pick(TONE_WORDS, seed2);
  const verb = pick(VERB_WORDS, seed);
  const t = (template: string) => fill(template, kw, brand, phone);

  const title = t(pick(TITLE_TEMPLATES, seed));
  const metaDescription = `${kw} 안내 - ${brand}는 골든리트리버×푸들 하이브리드 골든두들분양, 비용·성격·털빠짐·미니골든두들·오시두들·버니두들·파티두들까지 ${tone} ${verb}합니다. 문의 ${phone}.`;
  const relatedIntents = seededShuffle(
    [...RELATED_SUFFIXES.map((s) => `${kw} ${s}`), ...GENERIC_RELATED],
    seed3
  ).slice(0, 8);
  const metaKeywords = [kw, brand, ...relatedIntents.slice(0, 6), "골든두들", "하이브리드견"]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 12)
    .join(", ");

  const h1 = `${kw} - ${brand} 골든두들분양 안내`;
  const heroTitleLine1 = kw;
  const heroTitleLine2 = pick(HERO_LINE2_POOL, seed2);
  const heroBadge = t(pick(HERO_BADGE_POOL, seed3));
  const heroSubtitle = t(pick(HERO_SUBTITLES, seed));
  const heroBar = `${kw} 상담 ${phone}`;

  const leadIn = t(pick(LEAD_INS, seed2));
  const missionSection = {
    h2: t(pick(MISSION_H2, seed)),
    paragraphs: [
      leadIn,
      `골든두들은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견입니다. ${kw}${eunNeun(kw)} 크기·코트·성격·예산을 함께 보며 가정에 맞는 아이를 고르는 과정이 중요합니다.`,
      `${brand}는 분양가와 초기 비용, 털빠짐·미용 현실, 미니골든두들분양과 스탠다드 차이까지 ${tone} ${verb}합니다. 궁금한 점은 ${phone}로 문의해 주세요.`,
      `오시두들·버니두들·파티두들 등 골든두들종류와 비교가 필요해도 상담으로 정리해 드립니다.`,
    ],
  };

  const middleServices = seededShuffle(SERVICE_DEFS.slice(1, 5), seed);
  const orderedServices = [SERVICE_DEFS[0], ...middleServices, SERVICE_DEFS[5]];
  const services = orderedServices.map((svc, i) => ({
    title: t(pick(svc.titles, seed + i * 7)),
    description: svc.desc(kw, brand, phone, i % 2 === 0 ? tone : tone2),
  }));
  const servicesTitle = t(pick(SERVICES_H2, seed));
  const servicesIntro = `${kw} 문의 시 ${brand}가 확인하는 핵심 항목입니다. 상담부터 분양 후 케어까지 이어집니다.`;

  const facilitySection = {
    h2: t(pick(FACILITY_H2, seed2)),
    paragraphs: [
      `${kw} 이후에는 적응 기간의 식사·산책·빗질이 중요합니다. ${brand}는 개체 성향에 맞는 케어 포인트를 ${tone} 안내합니다.`,
      `코트 타입에 따라 미용 주기와 엉김 관리가 달라지므로, 분양 전 현실적인 관리 난이도를 함께 확인합니다.`,
      `보호자님이 가장 궁금해하시는 분양가격·비용·일정은 전화로 투명하게 ${verb}합니다.`,
    ],
  };

  const promiseTitles = ["정직하게", "맞춰서", "끝까지"] as const;
  const promiseDescs = [
    `${kw} 상담은 장점뿐 아니라 털빠짐·미용 부담도 솔직히 말씀드립니다.`,
    `주거·활동량·예산에 맞는 크기와 종류만 제안합니다.`,
    `입양 후에도 적응·케어 문의에 답하며 동행합니다.`,
  ];
  const promises = promiseTitles.map((title, i) => ({
    title,
    description: promiseDescs[i],
  }));
  const promisesTitle = t(pick(PROMISE_H2, seed2));

  const processTitle = t(pick(PROCESS_H2, seed3));
  const processSteps = [
    {
      step: "01",
      title: "전화 상담",
      description: `${phone}로 원하시는 조건(크기·성격·예산)을 알려 주세요.`,
    },
    {
      step: "02",
      title: "맞춤 안내",
      description: `${kw}에 맞는 아이·비용·케어 포인트를 ${tone} 설명합니다.`,
    },
    {
      step: "03",
      title: "만남·확정",
      description: `가능한 아이를 확인하고 분양 일정을 조율합니다.`,
    },
    {
      step: "04",
      title: "적응 케어",
      description: `입양 후 식사·미용·훈련 궁금증을 이어서 안내합니다.`,
    },
  ];

  const relatedSection = {
    h2: t(pick(RELATED_H2, seed3)),
    paragraphs: [
      `${kw}${eulReul(kw)} 찾아보신 분들은 ${relatedIntents.slice(0, 3).join(", ")} 등도 함께 확인합니다.`,
      `아래는 ${kw}${gwaWa(kw)} 자주 검색되는 관련 키워드입니다. 상담 시 함께 물어보셔도 됩니다.`,
    ],
  };

  const faqCount = 6 + (seed % 2);
  const faqOrder = seededShuffle(
    FAQ_DEFS.map((_, i) => i),
    seed2
  ).slice(0, faqCount);
  const faqs = faqOrder.map((defIndex) => {
    const def = FAQ_DEFS[defIndex];
    return { q: t(pick(def.questions, seed + defIndex * 5)), a: def.answer(kw, brand, phone) };
  });

  const now = new Date().toISOString();
  return {
    slug: slugifyKeyword(kw, `r${pageIndex}${seed.toString(36).slice(0, 4)}`),
    keyword: kw,
    title,
    metaDescription,
    metaKeywords,
    h1,
    heroSubtitle,
    heroBadge,
    heroTitleLine1,
    heroTitleLine2,
    heroBar,
    sections: [missionSection, facilitySection, relatedSection],
    faqs,
    images: pickImages(6, seed),
    ctaText: t(pick(CTA_TEMPLATES, seed)),
    services,
    servicesTitle,
    servicesIntro,
    promises,
    promisesTitle,
    processSteps,
    processTitle,
    relatedIntents,
    createdAt: now,
    updatedAt: now,
  };
}
