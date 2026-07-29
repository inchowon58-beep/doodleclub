import type { Metadata } from "next";
import { SITE, siteOgImageUrl } from "@/lib/site";
import { faqJsonLd, orgJsonLd, speakableJsonLd } from "@/lib/faq-data";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FixedCallButton from "./components/FixedCallButton";
import "./globals.css";

const ogImage = siteOgImageUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: `골든두들분양 | ${SITE.name} — 골든리트리버×푸들 하이브리드`,
    template: `%s | ${SITE.brand}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.brand }],
  creator: SITE.brand,
  publisher: SITE.brand,
  alternates: { canonical: SITE.siteUrl },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE.siteUrl,
    siteName: SITE.name,
    title: `골든두들분양 | ${SITE.name}`,
    description: SITE.description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "골든두들분양 · 골든두들 클럽",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `골든두들분양 | ${SITE.name}`,
    description: SITE.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  verification: {
    other: {
      "naver-site-verification": [
        "dd42e6efd8e128ba1aae6d21c92a1f6f4ca0806d",
        "b6dfca0cbe0557955eebddc842d00f71d644477d",
      ],
    },
  },
  other: {
    "msapplication-TileColor": "#2c2622",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = orgJsonLd();
  const faq = faqJsonLd();
  const speakable = speakableJsonLd();
  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="dd42e6efd8e128ba1aae6d21c92a1f6f4ca0806d"
        />
        <meta
          name="naver-site-verification"
          content="b6dfca0cbe0557955eebddc842d00f71d644477d"
        />
        {/* 네이버 수집용 — 확장자 있는 정적 JPG + image_src */}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <link rel="image_src" href={ogImage} />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE.name} RSS`}
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE.name} Feed`}
          href="/feed"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
        />
      </head>
      <body className="maison-root">
        <Header />
        <main>{children}</main>
        <Footer />
        <FixedCallButton />
      </body>
    </html>
  );
}
