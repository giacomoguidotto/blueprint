import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Blueprint - Modern web app template";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage({ params }: { params: { locale: string } }) {
  const isItalian = params.locale === "it";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f0f1a 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-3px",
            fontFamily: "monospace",
          }}
        >
          Blueprint
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#a0a0c0",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {isItalian
            ? "Template per web app moderne"
            : "Modern web app template"}
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {["Next.js", "Convex", "TypeScript", "Tailwind"].map((tech) => (
            <div
              key={tech}
              style={{
                padding: "8px 20px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.1)",
                color: "#c0c0e0",
                fontSize: "18px",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size }
  );
}
