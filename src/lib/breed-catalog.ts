import { KOREA_REGIONS } from "@/data/korea-regions";
import {
  BREED_DEFS,
  CAT_SHELTER_INTENTS,
  DOG_SHELTER_INTENTS,
  allBreedIntents,
  findBreedDefByIntent,
  intentsFor,
  isShelterIntent,
  type BreedCategory,
  type BreedDef,
} from "@/data/breed-defs";

export { isShelterIntent, DOG_SHELTER_INTENTS, CAT_SHELTER_INTENTS };

/** 경로가 보호소(파양입소·무료분양) 상세인지 */
export function isShelterPath(pathname: string): boolean {
  const m = pathname.match(/^\/(bunyang|goyang)\/([^/?#]+)/);
  if (!m) return false;
  let slug = m[2];
  try {
    slug = decodeURIComponent(slug);
  } catch {
    /* keep */
  }
  const intents = [...DOG_SHELTER_INTENTS, ...CAT_SHELTER_INTENTS].sort(
    (a, b) => b.length - a.length
  );
  for (const intent of intents) {
    if (slug === intent || slug.endsWith(`-${intent}`)) return true;
  }
  return false;
}

/**
 * 분양 전용 카탈로그.
 * 기존 public/seo-data·/guide·관리자 발행 목록과 완전 분리.
 */

/** 강아지분양 페이지 브랜드 (홈 골든두들 클럽과 분리) */
export const DOG_BRAND = "강아지분양클럽";
/** 고양이분양 페이지 브랜드 */
export const CAT_BRAND = "고양이분양클럽";

export const BREED_PHONE = "0505-464-1004";
export const BREED_PHONE_TEL = "tel:05054641004";
/** 보호소(파양입소·무료분양) 페이지 전화 버튼 문구 */
export const SHELTER_CTA_LABEL = "입소및무료분양 문의";

/** @deprecated 카테고리별 brandFor 사용 */
export const BREED_BRAND = DOG_BRAND;

export function brandFor(category: BreedCategory): string {
  return category === "cat" ? CAT_BRAND : DOG_BRAND;
}

export type BreedEntry = {
  slug: string;
  keyword: string;
  region: string | null;
  intent: string;
  def: BreedDef;
  category: BreedCategory;
};

export function breedBasePath(category: BreedCategory): string {
  return category === "cat" ? "/goyang" : "/bunyang";
}

export function breedPath(entry: Pick<BreedEntry, "slug" | "category">): string {
  return `${breedBasePath(entry.category)}/${encodeURIComponent(entry.slug)}`;
}

export function listBreedEntries(category?: BreedCategory): BreedEntry[] {
  const out: BreedEntry[] = [];
  const defs = category
    ? BREED_DEFS.filter((d) => d.category === category)
    : BREED_DEFS;

  for (const def of defs) {
    for (const intent of intentsFor(def)) {
      out.push({
        slug: intent,
        keyword: intent,
        region: null,
        intent,
        def,
        category: def.category,
      });
      for (const region of KOREA_REGIONS) {
        out.push({
          slug: `${region}-${intent}`,
          keyword: `${region} ${intent}`,
          region,
          intent,
          def,
          category: def.category,
        });
      }
    }
  }
  return out;
}

export function findBreedEntry(slug: string): BreedEntry | null {
  const decoded = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();

  const intents = allBreedIntents().sort((a, b) => b.length - a.length);

  for (const intent of intents) {
    if (decoded === intent) {
      const def = findBreedDefByIntent(intent);
      if (!def) return null;
      return {
        slug: intent,
        keyword: intent,
        region: null,
        intent,
        def,
        category: def.category,
      };
    }
    const prefix = `-${intent}`;
    if (decoded.endsWith(prefix)) {
      const region = decoded.slice(0, -prefix.length);
      if (region && (KOREA_REGIONS as readonly string[]).includes(region)) {
        const def = findBreedDefByIntent(intent);
        if (!def) return null;
        return {
          slug: decoded,
          keyword: `${region} ${intent}`,
          region,
          intent,
          def,
          category: def.category,
        };
      }
    }
  }
  return null;
}

export const BREED_INTENTS = allBreedIntents();
