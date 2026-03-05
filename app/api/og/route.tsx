import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 72 }}>🔀</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: "white", letterSpacing: -2 }}>
            WorkFlow Breaker
          </div>
        </div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.9)", fontWeight: 600, marginBottom: 16 }}>
          AI 工作流拆解專家
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)", maxWidth: 800, textAlign: "center" }}>
          輸入目標 → AI 自動拆解 → 結構化工作流程
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
          {["WBS", "User Story", "SIPOC", "5W1H"].map(m => (
            <div key={m} style={{ background: "rgba(255,255,255,0.2)", padding: "8px 20px", borderRadius: 999, color: "white", fontSize: 18, fontWeight: 700 }}>
              {m}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 30, fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
          workflow.atmarketing.tw
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
