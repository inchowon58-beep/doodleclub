import fs from "fs";
import path from "path";
import type { SeoPage } from "./seo-pages";
import { pickBreedImages } from "./breed-images";
import { isShelterIntent } from "@/data/breed-defs";
import {
  BREED_PHONE,
  BREED_PHONE_TEL,
  SHELTER_CTA_LABEL,
  brandFor,
  type BreedEntry,
} from "./breed-catalog";

export { BREED_PHONE, BREED_PHONE_TEL, SHELTER_CTA_LABEL };

type BreedCopy = {
  titles: string[];
  heroSubtitles: string[];
  heroLine2: string[];
  heroBadges: string[];
  missionH2: string[];
  leadIns: string[];
  services: { titles: string[]; descTemplate: string }[];
  facilityH2: string[];
  facilityParas: string[];
  promiseTitleSets: string[][];
  process: { title: string; descTemplate: string }[];
  faqs: { questions: string[]; answerTemplate: string }[];
  cta: string[];
  relatedSuffixes: string[];
};

const copyCache = new Map<string, BreedCopy>();

function loadCopy(id: string): BreedCopy {
  const cached = copyCache.get(id);
  if (cached) return cached;
  const dir = path.join(process.cwd(), "src", "data", "breed-copy");
  const file = path.join(dir, `${id}.json`);
  const fallback = path.join(dir, "gangaji.json");
  const target = fs.existsSync(file) ? file : fallback;
  if (!fs.existsSync(target)) {
    throw new Error(`분양 문구 파일 없음: breed-copy/${id}.json`);
  }
  const data = JSON.parse(fs.readFileSync(target, "utf-8")) as BreedCopy;
  copyCache.set(id, data);
  return data;
}

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

function fill(
  template: string,
  kw: string,
  brand: string,
  phone: string,
  region: string,
  label: string
): string {
  return template
    .replace(/\{kw\}(는|은)/g, `${kw}${eunNeun(kw)}`)
    .replace(/\{kw\}(를|을)/g, `${kw}${eulReul(kw)}`)
    .replace(/\{kw\}(와|과)/g, `${kw}${gwaWa(kw)}`)
    .replace(/\{kw\}(로|으로)/g, `${kw}${roEuro(kw)}`)
    .replace(/\{kw\}/g, kw)
    .replace(/\{brand\}/g, brand)
    .replace(/\{phone\}/g, phone)
    .replace(/\{region\}/g, region)
    .replace(/\{label\}/g, label);
}

const SHOP_TITLE_SUFFIXES = [
  "펫샵·애견샵 상담",
  "애견샵 분양 안내",
  "펫샵 책임분양",
  "애견분양 상담",
] as const;

const CAT_SHOP_SUFFIXES = [
  "펫샵 분양 상담",
  "고양이 펫샵 안내",
  "펫샵 책임분양",
] as const;

function withShopKeyword(title: string, isCat: boolean, seed: number): string {
  if (/펫샵|애견샵|애견분양/.test(title)) return title;
  const suffix = isCat
    ? pick(CAT_SHOP_SUFFIXES, seed)
    : pick(SHOP_TITLE_SUFFIXES, seed);
  if (title.includes("|")) {
    return title.replace(/\s*\|\s*/, ` | ${suffix} · `);
  }
  return `${title} | ${suffix}`;
}

/** 템플릿 1개 + 지역 치환 — 견종/묘종·보호소별 copy JSON 사용 */
export function generateBreedPage(entry: BreedEntry): SeoPage {
  const shelter = isShelterIntent(entry.intent);
  const copyId = shelter
    ? entry.category === "cat"
      ? "shelter-cat"
      : "shelter-dog"
    : entry.def.id;
  const copy = loadCopy(copyId);
  const kw = entry.keyword;
  const brand = brandFor(entry.category);
  const phone = BREED_PHONE;
  const region = entry.region || "전국";
  const label = entry.def.label;
  const isCat = entry.category === "cat";
  const seed = hash(`${entry.slug}|${brand}|doodle-breed1`);
  const seed2 = hash(`${entry.slug}|v2`);
  const seed3 = hash(`${entry.slug}|v3`);
  const t = (template: string) => fill(template, kw, brand, phone, region, label);

  const rawTitle = t(pick(copy.titles, seed));
  const title = shelter ? rawTitle : withShopKeyword(rawTitle, isCat, seed2);

  const metaDescription = shelter
    ? `${kw} 안내 — ${brand}에서 개인 사정 파양입소와 무료분양 매칭을 상담합니다. 군입대·이민·이사·보호자 부재 등 양육이 어려울 때 입소 후 새 가정을 연결합니다. 문의 ${phone}.`
    : `${kw} 안내 — ${brand} 펫샵·${
        isCat ? "분양" : "애견샵"
      } 상담으로 ${label} 책임분양을 진행합니다. 건강 확인, 성향 매칭, 사후 케어까지. 문의 ${phone}.`;

  const relatedIntents = seededShuffle(
    shelter
      ? [
          ...copy.relatedSuffixes.map((s) => `${kw} ${s}`),
          isCat ? "고양이파양" : "강아지파양",
          isCat ? "고양이보호소" : "강아지보호소",
          isCat ? "유기묘보호소" : "유기견보호소",
          `${label}무료분양`,
          "파양입소",
          "무료분양",
        ]
      : [
          ...copy.relatedSuffixes.map((s) => `${kw} ${s}`),
          ...entry.def.intents,
          `${label}무료분양`,
          isCat ? "고양이분양" : "강아지분양",
          isCat ? "펫샵" : "애견분양",
          isCat ? "고양이펫샵" : "애견샵",
          "펫샵",
          `${label}분양`,
        ],
    seed3
  ).slice(0, 8);

  const metaKeywords = (
    shelter
      ? [
          kw,
          brand,
          "파양입소",
          "무료분양",
          isCat ? "고양이파양" : "강아지파양",
          isCat ? "고양이보호소" : "강아지보호소",
          ...relatedIntents.slice(0, 5),
        ]
      : [
          kw,
          brand,
          label,
          isCat ? "고양이분양" : "강아지분양",
          isCat ? "펫샵" : "애견샵",
          "펫샵",
          ...(isCat ? [] : ["애견분양", `${label}무료분양`]),
          ...relatedIntents.slice(0, 4),
        ]
  )
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 14)
    .join(", ");

  const h1 = shelter
    ? `${kw} - ${brand} 파양입소·무료분양 상담`
    : `${kw} - ${brand} ${label} 펫샵 분양 상담`;
  const heroTitleLine1 = kw;
  const heroTitleLine2 = t(pick(copy.heroLine2, seed2));
  const heroBadge = t(pick(copy.heroBadges, seed3));
  const heroSubtitle = t(pick(copy.heroSubtitles, seed));
  const heroBar = shelter
    ? `${kw} · 입소및무료분양 문의 ${phone}`
    : `${kw} · 펫샵 상담 ${phone}`;

  const shopWord = isCat ? "펫샵" : "펫샵·애견샵";
  const missionSection = shelter
    ? {
        h2: t(pick(copy.missionH2, seed)),
        paragraphs: [
          t(pick(copy.leadIns, seed2)),
          `${kw}${eunNeun(kw)} 파양입소와 무료분양을 함께 안내합니다. 군입대·이민·이사·보호자 부재·직장·학업·가족 구성 변화처럼 더 이상 키우기 어려운 개인 사정이 있을 때 입소를 상담합니다.`,
          `입소된 아이는 성향과 케어 정보를 정리한 뒤 ${label}무료분양으로 새 가정과 연결됩니다. ${kw} 문의는 ${phone}로 가능합니다.`,
          `무리한 권유 없이 입소 절차와 매칭 흐름만 차분히 설명드리니, 상황이 급하셔도 먼저 전화로 말씀해 주세요.`,
        ],
      }
    : {
        h2: t(pick(copy.missionH2, seed)),
        paragraphs: [
          t(pick(copy.leadIns, seed2)),
          `${kw}${eunNeun(kw)} ${label}${gwaWa(label)}의 평생 반려를 위한 첫 단계입니다. ${brand} ${shopWord}에서는 보호자님의 생활 패턴과 주거 환경을 먼저 듣고, 성향이 맞는 아이를 신중하게 안내합니다.`,
          `건강 상태·접종 이력·초기 케어 방법을 투명하게 공유하며, 무리한 권유 없이 상담 중심으로 진행합니다. ${kw} 및 ${label}무료분양 문의는 ${phone}로 가능합니다.`,
          `${label}가 새 가정에 잘 적응할 수 있도록, 분양 전 가이드와 분양 후 안부 확인까지 이어갑니다.`,
        ],
      };

  const middle = seededShuffle(copy.services.slice(1, 5), seed);
  const ordered = [copy.services[0], ...middle, copy.services[5]];
  const services = ordered.map((svc, i) => ({
    title: t(pick(svc.titles, seed + i * 7)),
    description: t(svc.descTemplate),
  }));
  const servicesTitle = `${kw} 핵심 안내`;
  const servicesIntro = shelter
    ? `${kw} 상담 시 ${brand}가 안내하는 파양입소·무료분양 핵심 흐름입니다.`
    : `${kw} 상담 시 ${brand} ${shopWord}가 안내하는 핵심 서비스입니다. 매칭부터 사후 케어까지 한 흐름으로 이어집니다.`;

  const facilitySection = {
    h2: t(pick(copy.facilityH2, seed2)),
    paragraphs: copy.facilityParas.map((p) => t(p)),
  };

  const promiseTitles = pick(copy.promiseTitleSets, seed);
  const promiseDescs = shelter
    ? [
        `${kw} 상담은 개인 사정과 아이 상태를 먼저 확인합니다.`,
        `입소·케어·무료분양 절차를 가감 없이 안내하고, 이후 문의에도 응답합니다.`,
        `연락처(${phone})와 다음 단계를 명확히 안내해 안심하고 결정할 수 있게 돕습니다.`,
      ]
    : [
        `${kw} 상담은 아이와 보호자 모두의 조건을 먼저 확인합니다.`,
        `건강·이력·케어 방법을 가감 없이 안내하고, 분양 후에도 문의에 응답합니다.`,
        `절차와 연락처(${phone})를 명확히 안내해 안심하고 결정할 수 있게 돕습니다.`,
      ];
  const promises = promiseTitles.map((titleText, i) => ({
    title: titleText,
    description: promiseDescs[i],
  }));
  const promisesTitle = `${brand}의 세 가지 약속`;

  const processTitle = `${kw} 진행 4단계`;
  const processSteps = copy.process.map((step, i) => ({
    step: String(i + 1).padStart(2, "0"),
    title: step.title.replace(/^\d+\.\s*/, ""),
    description: t(step.descTemplate),
  }));

  const relatedSection = {
    h2: `${kw}와 함께 찾는 키워드`,
    paragraphs: [
      `${kw}${eulReul(kw)} 찾아보신 분들은 ${relatedIntents.slice(0, 3).join(", ")} 등도 함께 확인합니다.`,
      `궁금한 점이 있으면 ${phone}로 편하게 문의해 주세요.`,
    ],
  };

  const faqCount = 6 + (seed % 2);
  const faqOrder = seededShuffle(
    copy.faqs.map((_, i) => i),
    seed2
  ).slice(0, faqCount);
  const faqs = faqOrder.map((defIndex) => {
    const def = copy.faqs[defIndex];
    return {
      q: t(pick(def.questions, seed + defIndex * 5)),
      a: t(def.answerTemplate),
    };
  });

  const ctaText = t(pick(copy.cta, seed));
  const now = new Date().toISOString();

  return {
    slug: entry.slug,
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
    images: pickBreedImages(entry.def.imageBase, entry.def.imageCount, 6, seed),
    ctaText,
    ctaButtonLabel: shelter ? SHELTER_CTA_LABEL : undefined,
    isShelter: shelter,
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
