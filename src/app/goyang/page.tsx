import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import {
  listBreedEntries,
  CAT_BRAND,
  BREED_PHONE,
} from "@/lib/breed-catalog";
import BreedList from "@/app/bunyang/BreedList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `고양이분양 | ${CAT_BRAND} 묘종·지역별 펫샵 안내`,
  description: `${CAT_BRAND} 고양이분양 — 묘종·지역별 펫샵 분양과 고양이보호소·파양입소·무료분양 안내. 문의 ${BREED_PHONE}`,
  alternates: { canonical: `${SITE.siteUrl}/goyang` },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function GoyangIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const all = listBreedEntries("cat");
  return (
    <BreedList
      title="고양이분양"
      lead="묘종·지역별 고양이 분양 · 무료분양 안내"
      basePath="/goyang"
      all={all}
      pageNum={pageNum}
    />
  );
}
