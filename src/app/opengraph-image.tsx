import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TestLink — Free Online Mock Test Maker";
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
          backgroundColor: "#07070C",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(230,57,70,0.15) 0%, rgba(7,7,12,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -300,
            left: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,107,0.1) 0%, rgba(7,7,12,0) 70%)",
          }}
        />

        <div style={{ display: "flex", width: "100%", height: "100%", padding: 64 }}>
          {/* Left Column: Text & Value Prop */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40, justifyContent: "center" }}>
            
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
              <svg viewBox="0 0 100 100" width="48" height="48" fill="none" style={{ background: "transparent" }}>
                <path d="M25 45 C 10 45, 10 75, 25 75 L 45 75 C 60 75, 60 45, 45 45 Z" stroke="rgba(168,168,191,0.5)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 35 55 L 55 75 L 85 25" stroke="#E63946" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: "#F0F0F5", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
                TestLink
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ color: "white", fontSize: 64, fontWeight: 800, letterSpacing: -2, lineHeight: 1.1, margin: 0, marginBottom: 24 }}>
              Turn PDFs into Live Tests in 60s
            </h1>

            {/* Sub-headline */}
            <p style={{ color: "#7C7C9A", fontSize: 32, fontWeight: 500, margin: 0, lineHeight: 1.4, maxWidth: 600 }}>
              Ditch Google Forms. AI parses your questions. Students compete on live leaderboards.
            </p>

            {/* URL Footer */}
            <div style={{ display: "flex", alignItems: "center", marginTop: 48 }}>
              <div style={{ background: "rgba(230, 57, 70, 0.1)", border: "1px solid rgba(230, 57, 70, 0.3)", borderRadius: 100, padding: "8px 24px" }}>
                <span style={{ color: "#FF6B6B", fontSize: 24, fontWeight: 600 }}>
                  testlink.online
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div style={{ 
              display: "flex", 
              width: 480, 
              alignItems: "center", 
              justifyContent: "center",
              position: "relative"
            }}>
            
            {/* Fake Phone Screen */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              width: 380,
              height: 520,
              background: "#0F0F18",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 32,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 8px rgba(255,255,255,0.03)",
              overflow: "hidden",
            }}>
              {/* Fake Phone Header */}
              <div style={{ display: "flex", background: "#181825", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexDirection: "column", gap: 4 }}>
                <span style={{ color: "white", fontSize: 18, fontWeight: 700 }}>NEET Mock Test</span>
                <span style={{ color: "#E63946", fontSize: 14, fontWeight: 600 }}>Live Leaderboard</span>
              </div>

              {/* Leaderboard Rows */}
              <div style={{ display: "flex", flexDirection: "column", padding: 24, gap: 12 }}>
                {[
                  { rank: "#1", name: "Ramesh K.", score: "50/50", color: "#FFB020", bg: "rgba(255,176,32,0.1)" },
                  { rank: "#2", name: "Priya S.", score: "49/50", color: "#A8B0BE", bg: "rgba(168,176,190,0.1)" },
                  { rank: "#3", name: "Aarav M.", score: "48/50", color: "#C68743", bg: "rgba(198,135,67,0.1)" },
                  { rank: "#4", name: "Sneha P.", score: "47/50", color: "#7C7C9A", bg: "rgba(255,255,255,0.02)" },
                  { rank: "#5", name: "Rajat D.", score: "45/50", color: "#7C7C9A", bg: "rgba(255,255,255,0.02)" },
                ].map((row) => (
                  <div key={row.rank} style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: row.bg, borderRadius: 12, border: "1px solid rgba(255,255,255,0.02)" }}>
                    <span style={{ color: row.color, fontSize: 16, fontWeight: 700, width: 32 }}>{row.rank}</span>
                    <span style={{ color: "#F0F0F5", fontSize: 16, fontWeight: 500, flex: 1 }}>{row.name}</span>
                    <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>{row.score}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
