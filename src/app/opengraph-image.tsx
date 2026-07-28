import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { OgBrandedLayout, OG_SIZE } from "@/lib/og-template";

export const alt = "골든두들분양 · 골든두들 클럽";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgBrandedLayout
        brandName={SITE.brand}
        title="골든두들분양"
        subtitle="골든리트리버 × 푸들 하이브리드 · 비용·성격·털빠짐·종류 안내"
        badge="Golden Doodle Club"
      />
    ),
    {
      ...OG_SIZE,
      headers: {
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    }
  );
}
