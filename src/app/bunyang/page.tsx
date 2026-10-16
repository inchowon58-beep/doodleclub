import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import {
  listBreedEntries,
  DOG_BRAND,
  BREED_PHONE,
} from "@/lib/breed-catalog";
import BreedList from "./BreedList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `강아지분양 | ${DOG_BRAND} 견종·지역별 펫샵 안내`,
  description: `${DOG_BRAND} 강아지분양 — 견종·지역별 애견샵·펫샵 분양과 강아지보호소·파양입소·무료분양 안내. 문의 ${BREED_PHONE}`,
  alternates: { canonical: `${SITE.siteUrl}/bunyang` },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BunyangIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const all = listBreedEntries("dog");
  return (
    <BreedList
      title="강아지분양"
      lead="견종·지역별 강아지 분양 · 무료분양 · 애견분양 안내"
      basePath="/bunyang"
      all={all}
      pageNum={pageNum}
    />
  );
}
