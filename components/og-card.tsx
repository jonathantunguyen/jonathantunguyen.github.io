import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { pick, ui, type Locale } from "@/lib/i18n";

export const ogSize = { width: 1200, height: 630 };

/**
 * The link-preview card, in one locale. Satori (behind `ImageResponse`) needs
 * an explicit `display` on any element with more than one child — hence the
 * flex on the comment row.
 */
export function ogCard(locale: Locale) {
  const roles = profile.roles.map((role) =>
    pick(role, locale).replace(/^TODO:\s*/, ""),
  );
  const comment = ui(locale).panes.homeComment;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#11161d",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#7ee787", fontSize: 30 }}>
          <span style={{ color: "#7d8590" }}>{"// "}</span>
          <span>{comment}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#e6edf3", fontSize: 130, fontWeight: 800 }}>
            {profile.firstName}
          </span>
          <span style={{ color: "#6366f1", fontSize: 130, fontWeight: 800 }}>
            {profile.lastName}
          </span>
        </div>

        <div
          style={{
            height: 4,
            width: 560,
            background: "#22d3ee",
            marginTop: 36,
          }}
        />

        <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
          {roles.map((role) => (
            <span
              key={role}
              style={{
                color: "#e6edf3",
                fontSize: 26,
                border: "1px solid #1f2630",
                borderRadius: 8,
                padding: "10px 20px",
              }}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
