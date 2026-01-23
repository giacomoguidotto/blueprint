import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import type { NextFetchEvent, NextRequest } from "next/server";
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

export async function proxy(req: NextRequest, ev: NextFetchEvent) {
  const intlResponse = intlMiddleware(req);

  if (
    intlResponse.headers.get("x-middleware-rewrite") === null &&
    intlResponse.status !== 200
  ) {
    return intlResponse; // intl middleware redirecting
  }

  const authResponse = await authMiddleware(req, ev);

  if (!authResponse) {
    return intlResponse;
  }

  const intlLocale = intlResponse.headers.get("x-next-intl-locale");
  if (intlLocale) {
    authResponse.headers.set("x-next-intl-locale", intlLocale);
  }

  const linkHeader = intlResponse.headers.get("link");
  if (linkHeader) {
    authResponse.headers.set("link", linkHeader);
  }

  return authResponse;
}

export const config = {
  matcher: [
    // Match all paths except internals, static files, and callback
    "/((?!_next|callback|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
