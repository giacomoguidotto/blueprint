import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      "/",
      "/:locale",
      "/:locale/sign-in",
      "/:locale/sign-up",
    ],
  },
});

/**
 * Generate Content Security Policy header with nonce
 *
 * Protects against XSS attacks, clickjacking, and code injection.
 * Uses nonce-based CSP for inline scripts and styles.
 */
function generateCSPHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";

  const cspDirectives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
    isDev
      ? `style-src 'self' 'unsafe-inline'`
      : `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.workos.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    "upgrade-insecure-requests",
  ];

  return cspDirectives.join("; ");
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const intlResponse = intlMiddleware(request);

  if (
    intlResponse.headers.get("x-middleware-rewrite") === null &&
    intlResponse.status !== 200
  ) {
    return intlResponse; // intl middleware redirecting
  }

  const authResponse = await authMiddleware(request, event);

  let response: NextResponse | Response = intlResponse;

  if (authResponse) {
    // merging auth and intl responses
    response = authResponse;

    const intlLocale = intlResponse.headers.get("x-next-intl-locale");
    if (intlLocale) {
      response.headers.set("x-next-intl-locale", intlLocale);
    }

    const linkHeader = intlResponse.headers.get("link");
    if (linkHeader) {
      response.headers.set("link", linkHeader);
    }
  }

  // setting CSP header with nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = generateCSPHeader(nonce);
  response.headers.set("Content-Security-Policy", cspHeader);

  // nonce available to the app via header
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except internals, static files, and callback
    "/((?!_next|callback|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
