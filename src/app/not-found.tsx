import { FileQuestion, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          backgroundColor: "#0a0a12",
          color: "#e8e8f0",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(10,10,18,0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              height: "64px",
              padding: "0 1rem",
            }}
          >
            <Link
              href="/en"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "#5b4de0",
                }}
              >
                <Sparkles size={16} color="white" />
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                }}
              >
                Blueprint
              </span>
            </Link>
          </div>
        </header>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <FileQuestion
            size={64}
            style={{ marginBottom: "1.5rem", opacity: 0.4 }}
          />
          <h1
            style={{
              fontSize: "4rem",
              fontFamily: "monospace",
              fontWeight: 700,
              margin: "0 0 0.5rem",
              letterSpacing: "-0.05em",
            }}
          >
            404
          </h1>
          <p style={{ fontSize: "1.25rem", margin: "0 0 0.25rem", fontFamily: "monospace" }}>
            Page not found
          </p>
          <p style={{ color: "#888", margin: "0 0 2rem" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/en"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              backgroundColor: "#e8e8f0",
              color: "#0a0a12",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
