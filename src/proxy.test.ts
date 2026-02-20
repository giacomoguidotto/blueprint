import { describe, expect, it, vi } from "vitest";

// Mock Next.js and WorkOS modules that proxy.ts imports
vi.mock("@workos-inc/authkit-nextjs", () => ({
  authkitMiddleware: () => vi.fn(),
}));
vi.mock("next/server", () => ({
  NextRequest: vi.fn(),
  NextResponse: vi.fn(),
}));
vi.mock("next-intl/middleware", () => ({
  default: () => vi.fn(),
}));
vi.mock("./i18n/routing", () => ({
  routing: {},
}));

const { generateCSPHeader } = await import("./proxy");

describe("generateCSPHeader", () => {
  const csp = generateCSPHeader("test-nonce");

  it("returns a non-empty string", () => {
    expect(csp).toBeTruthy();
    expect(typeof csp).toBe("string");
  });

  it("contains default-src directive", () => {
    expect(csp).toContain("default-src 'self'");
  });

  it("contains script-src directive", () => {
    expect(csp).toContain("script-src");
  });

  it("contains connect-src with Convex domains", () => {
    expect(csp).toContain("connect-src");
    expect(csp).toContain("*.convex.cloud");
  });

  it("contains frame-ancestors 'none' for clickjacking protection", () => {
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("includes upgrade-insecure-requests", () => {
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("contains WorkOS domains for auth", () => {
    expect(csp).toContain("api.workos.com");
    expect(csp).toContain("authkit.workos.com");
  });

  it("separates directives with semicolons", () => {
    const directives = csp.split("; ");
    expect(directives.length).toBeGreaterThan(5);
  });
});
