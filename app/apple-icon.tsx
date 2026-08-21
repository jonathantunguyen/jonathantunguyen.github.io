import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Required by output: export: generated once at build time.
export const dynamic = "force-static";

/**
 * The favicon mark (app/icon.svg) without the rounded tile: iOS applies its
 * own corner mask, so the background bleeds to the edges. The glyph is inlined
 * as an SVG data URI so it stays identical to the favicon instead of
 * re-approximating the "J" with a font.
 */
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="14 9 36 50">
  <path d="M 24 15 H 44 M 38 15 V 34 Q 38 45 29.5 45 Q 23 45 22.5 38"
        fill="none" stroke="#e6edf3" stroke-width="7" stroke-linecap="round"/>
  <rect x="22" y="52" width="24" height="5" rx="2.5" fill="#22d3ee"/>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1117",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml,${encodeURIComponent(mark)}`}
          width={94}
          height={130}
          alt=""
        />
      </div>
    ),
    size,
  );
}
