import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TestLink — Instant Test Links for Educators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#07070C",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Gradient glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            borderRadius: "50%",
            background: "rgba(230, 57, 70, 0.08)",
            filter: "blur(80px)",
          }}
        />

        {/* Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #E63946, #FF6B6B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: 32, fontWeight: 800 }}>T</span>
          </div>
          <span style={{ color: "#F0F0F5", fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>
            TestLink
          </span>
        </div>

        {/* Tagline */}
        <p style={{ color: "#7C7C9A", fontSize: 28, fontWeight: 500, margin: 0, marginBottom: 40, textAlign: "center", maxWidth: 700 }}>
          Instant test links for educators. AI-powered parsing. Live leaderboards.
        </p>

        {/* Mini leaderboard preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: "rgba(15, 15, 24, 0.8)",
            border: "1px solid rgba(30, 30, 58, 0.6)",
            borderRadius: 16,
            padding: "16px 32px",
            width: 460,
          }}
        >
          {[
            { rank: "#1", name: "Ramesh K.", score: "50/50", color: "#FFB800" },
            { rank: "#2", name: "Priya S.", score: "49/50", color: "#A8B0BE" },
            { rank: "#3", name: "Aarav M.", score: "48/50", color: "#C47F32" },
          ].map((row) => (
            <div
              key={row.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "8px 0",
              }}
            >
              <span style={{ color: row.color, fontSize: 16, fontWeight: 700, fontFamily: "monospace", width: 32 }}>
                {row.rank}
              </span>
              <span style={{ color: "#F0F0F5", fontSize: 16, flex: 1 }}>{row.name}</span>
              <span style={{ color: "#7C7C9A", fontSize: 16, fontFamily: "monospace" }}>{row.score}</span>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p style={{ color: "#4A4A68", fontSize: 16, position: "absolute", bottom: 32 }}>
          testlink.in — Free for all educators
        </p>
      </div>
    ),
    { ...size }
  );
}
