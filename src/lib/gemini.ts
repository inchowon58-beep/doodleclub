import { GoogleGenerativeAI } from "@google/generative-ai";
import { SITE } from "./site";
import { pickImages } from "./images";
import type { SeoPage } from "./seo-pages";
import { slugifyKeyword } from "./seo-pages";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function buildPrompt(keyword: string): string {
  return `당신은 '${SITE.brand}'(${SITE.nameEn})의 SEO·AEO 웹문서 작성 전문가입니다.
업체명은 반드시 '${SITE.brand}'만 사용하세요. 카카오톡·인스타그램·특정 주소·지점명은 절대 언급하지 마세요.

메인 키워드: ${keyword}
전화: ${SITE.phone}
주제: 골든두들분양. 골든두들은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견.
관련: 골든두들비용, 분양가, 가격, 특징, 성격, 털빠짐, 미니골든두들분양, 오시두들, 버니두들, 파티두들, 골든두들종류.

아래 JSON만 출력하세요. 설명·마크다운 금지, 순수 JSON만.

{
  "title": "60자 내. '${keyword}' + ${SITE.brand} 포함",
  "metaDescription": "140~160자. '${keyword}', 골든두들분양, 비용/성격/털빠짐, 전화 유도",
  "metaKeywords": "${keyword} 포함 8~12개, 쉼표 구분",
  "h1": "키워드 '${keyword}' 포함 H1",
  "heroTitleLine1": "히어로 1줄: '${keyword}'",
  "heroTitleLine2": "히어로 2줄: 짧은 감성 문구",
  "heroBadge": "짧은 배지 (예: 골든두들분양 · ${SITE.brand})",
  "heroSubtitle": "영문 또는 한영 혼합 부제",
  "heroBar": "히어로 하단 강조 문장",
  "sections": [
    {"h2": "소개 — '${keyword}' 핵심 안내", "paragraphs": ["180자+", "160자+", "160자+"]},
    {"h2": "케어·적응 안내", "paragraphs": ["160자+", "160자+", "140자+"]},
    {"h2": "관련 검색 의도", "paragraphs": ["140자+", "120자+"]}
  ],
  "servicesTitle": "${SITE.brand} 핵심 안내 6가지",
  "servicesIntro": "핵심 안내 6가지 리드 문장",
  "services": [
    {"title": "전화 상담", "description": "80자+"},
    {"title": "크기·세대 안내", "description": "80자+"},
    {"title": "코트·털빠짐", "description": "80자+"},
    {"title": "분양가·비용", "description": "80자+"},
    {"title": "두들 종류 비교", "description": "80자+"},
    {"title": "분양 후 케어", "description": "80자+"}
  ],
  "promisesTitle": "${SITE.brand}의 세 가지 약속",
  "promises": [
    {"title": "정직하게", "description": "60자+"},
    {"title": "맞춰서", "description": "60자+"},
    {"title": "끝까지", "description": "60자+"}
  ],
  "processTitle": "'${keyword}' 진행 4단계",
  "processSteps": [
    {"step": "01", "title": "전화 상담", "description": "80자+, ${SITE.phone} 포함"},
    {"step": "02", "title": "맞춤 안내", "description": "80자+"},
    {"step": "03", "title": "만남·확정", "description": "80자+"},
    {"step": "04", "title": "적응 케어", "description": "80자+"}
  ],
  "relatedIntents": ["관련 검색어 6~8개"],
  "faqs": [
    {"q": "질문1 — '${keyword}' 포함", "a": "답변 80자+"},
    {"q": "질문2", "a": "답변 80자+"},
    {"q": "질문3 — '${keyword}' 포함", "a": "답변 80자+"},
    {"q": "질문4", "a": "답변 80자+"},
    {"q": "질문5", "a": "답변 80자+"},
    {"q": "질문6 — '${keyword}' 포함", "a": "답변 80자+"}
  ],
  "ctaText": "분양 상담 전화(${SITE.phone}) 유도 문장"
}

요구사항:
- 과장·허위 금지. 완전 무탈모 보장 금지.
- FAQ 최소 6개, AEO(질문형) 유지.
- '${keyword}'를 자연스럽게 반복하되 스팸처럼 남발하지 마세요.`;
}

type GeminiSeoPartial = Omit<
  SeoPage,
  "slug" | "images" | "createdAt" | "updatedAt"
> & { keyword: string };

export async function generateWithGemini(
  keyword: string,
  apiKey?: string
): Promise<GeminiSeoPartial> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY가 없습니다.");

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(buildPrompt(keyword));
  const text = result.response.text();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = (fence ? fence[1] : text).trim();
  const data = JSON.parse(jsonText) as Record<string, unknown>;

  const sections = Array.isArray(data.sections)
    ? (data.sections as SeoPage["sections"])
    : [];
  const faqs = Array.isArray(data.faqs) ? (data.faqs as SeoPage["faqs"]) : [];
  const services = Array.isArray(data.services)
    ? (data.services as NonNullable<SeoPage["services"]>)
    : undefined;
  const promises = Array.isArray(data.promises)
    ? (data.promises as NonNullable<SeoPage["promises"]>)
    : undefined;
  const processSteps = Array.isArray(data.processSteps)
    ? (data.processSteps as NonNullable<SeoPage["processSteps"]>)
    : undefined;
  const relatedIntents = Array.isArray(data.relatedIntents)
    ? (data.relatedIntents as string[])
    : undefined;

  return {
    keyword,
    title: String(data.title || `${keyword} | ${SITE.brand}`),
    metaDescription: String(
      data.metaDescription ||
        `${keyword} 안내 - ${SITE.brand} 골든두들분양. 문의 ${SITE.phone}`
    ),
    metaKeywords: String(
      data.metaKeywords || `${keyword}, 골든두들분양, ${SITE.brand}`
    ),
    h1: String(data.h1 || `${keyword} - ${SITE.brand}`),
    heroSubtitle: String(data.heroSubtitle || SITE.taglineEn),
    heroBadge: data.heroBadge
      ? String(data.heroBadge)
      : `골든두들분양 · ${SITE.brand}`,
    heroTitleLine1: data.heroTitleLine1
      ? String(data.heroTitleLine1)
      : keyword,
    heroTitleLine2: data.heroTitleLine2
      ? String(data.heroTitleLine2)
      : "우리 집에 맞는 두들을 만나세요",
    heroBar: data.heroBar ? String(data.heroBar) : `${keyword} 상담`,
    sections,
    faqs,
    ctaText: String(data.ctaText || `${SITE.phone}로 분양 상담`),
    services,
    servicesTitle: data.servicesTitle
      ? String(data.servicesTitle)
      : undefined,
    servicesIntro: data.servicesIntro
      ? String(data.servicesIntro)
      : undefined,
    promises,
    promisesTitle: data.promisesTitle
      ? String(data.promisesTitle)
      : undefined,
    processSteps,
    processTitle: data.processTitle ? String(data.processTitle) : undefined,
    relatedIntents,
  };
}

export function finalizeGeminiPage(
  partial: GeminiSeoPartial,
  pageIndex = 1
): SeoPage {
  const now = new Date().toISOString();
  const seed =
    Math.abs(
      Array.from(`${partial.keyword}|${pageIndex}`)
        .reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 0)
    ) || 42;
  return {
    ...partial,
    slug: slugifyKeyword(partial.keyword, `g${pageIndex}`),
    images: pickImages(6, seed),
    createdAt: now,
    updatedAt: now,
  };
}

/** 관리자 발행 API 호환 */
export function assembleSeoPage(partial: GeminiSeoPartial): SeoPage {
  return finalizeGeminiPage(partial);
}
