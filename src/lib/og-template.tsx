import type { CSSProperties, ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  dark: "#2c2622",
  gold: "#b08d6a",
  goldSoft: "#d4b896",
  white: "#ffffff",
  gray: "#a89f96",
  pearl: "#f7f3ef",
};

interface OgBrandedProps {
  brandName: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function OgBrandedLayout({
  brandName,
  title,
  subtitle,
  badge,
}: OgBrandedProps): ReactNode {
  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "56px 64px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    background: `linear-gradient(155deg, #2c2622 0%, #3d3530 42%, #b08d6a 155%)`,
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            background: "linear-gradient(160deg, #FFE8DC 0%, #F5E6D3 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: OG_COLORS.dark,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          GDC
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: OG_COLORS.white, fontSize: 36, fontWeight: 700 }}>
            {brandName}
          </div>
          <div style={{ color: OG_COLORS.goldSoft, fontSize: 20, letterSpacing: "0.12em" }}>
            Golden Doodle Club
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
        {badge && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.12)",
              color: OG_COLORS.goldSoft,
              fontSize: 20,
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: 999,
              border: "1px solid rgba(212,184,150,0.35)",
            }}
          >
            {badge}
          </div>
        )}
        <div
          style={{
            color: OG_COLORS.white,
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ color: "#d9d2cb", fontSize: 26, lineHeight: 1.45 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ color: OG_COLORS.gray, fontSize: 20, letterSpacing: "0.08em" }}>
        goldendoodle · mini · aussie · berne · parti
      </div>
    </div>
  );
}
