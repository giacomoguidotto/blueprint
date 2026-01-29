import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import {
  type NextFetchEvent,
  NextRequest,
  type NextResponse,
} from "next/server";
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
 * Uses nonce-based CSP for inline scripts and styles in production.
 * Relaxed policy in development for hot reloading and debugging.
 *
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */
function generateCSPHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";

  const cspDirectives = [
    `default-src 'self'`,
    // Development: Allow unsafe-inline and unsafe-eval for hot reloading
    // Production: Use nonce with unsafe-inline as fallback for older browsers
    isDev
      ? `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live`
      : `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://vercel.live`,
    isDev
      ? `style-src 'self' 'unsafe-inline'`
      : `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    // Allow connections to Convex backend, WorkOS auth, and Vercel Live
    `connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.workos.com https://vercel.live`,
    // Allow forms to submit to WorkOS auth endpoints
    `form-action 'self' https://api.workos.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    "upgrade-insecure-requests",
  ];

  return cspDirectives.join("; ");
}

export async function proxy(
  initialRequest: NextRequest,
  event: NextFetchEvent
) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = generateCSPHeader(nonce);

  // Add nonce to request headers so Next.js can apply it during SSR
  const requestHeaders = new Headers(initialRequest.headers);
  requestHeaders.set("x-nonce", nonce);

  const request = new NextRequest(initialRequest, {
    headers: requestHeaders,
  });

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

  // Set CSP header and nonce in response
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    /**
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, other static assets
     * - callback (auth callback)
     */
    {
      source:
        "/((?!_next/static|_next/image|callback|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
      // Exclude prefetch requests (next/link prefetching)
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/(api|trpc)(.*)",
    },
  ],
};
