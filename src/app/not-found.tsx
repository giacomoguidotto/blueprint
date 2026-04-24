import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "4rem", margin: "0 0 0.5rem" }}>404</h1>
        <p style={{ fontSize: "1.25rem", color: "#666", margin: "0 0 2rem" }}>
          Page not found
        </p>
        <Link
          href="/en"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontSize: "1rem",
          }}
        >
          Go home
        </Link>
      </body>
    </html>
  );
}
