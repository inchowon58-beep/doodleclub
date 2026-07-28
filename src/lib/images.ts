import { SITE } from "./site";

/** doodle 01.webp ~ imageCount.webp */
export function imageUrl(index: number): string {
  const n = Math.max(1, Math.min(SITE.imageCount, index));
  return `${SITE.imageBase}/${String(n).padStart(2, "0")}.webp`;
}

export function allImageUrls(): string[] {
  return Array.from({ length: SITE.imageCount }, (_, i) => imageUrl(i + 1));
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickImages(count: number, seed = 42): string[] {
  const pool = allImageUrls();
  const rng = mulberry32(seed);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function galleryAlt(keyword: string, index: number): string {
  const suffixes = [
    "골든두들분양",
    "골든두들 프로필",
    "미니골든두들",
    "골든두들 클럽",
  ];
  const suffix = suffixes[(index - 1) % suffixes.length];
  return `${keyword} ${suffix} ${index}`;
}
