import { withAuth } from "@workos-inc/authkit-nextjs";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Layout for authenticated routes.
 *
 * This layout uses server-side auth check via `withAuth({ ensureSignedIn: true })`.
 * If the user isn't signed in, they'll be redirected to AuthKit automatically.
 *
 * Note: The middleware in proxy.ts already protects these routes, but this provides
 * an additional server-side guarantee and makes the auth requirement explicit.
 */
export default async function AuthenticatedLayout({ children }: Props) {
  // Ensures user is signed in, redirects to AuthKit if not
  await withAuth({ ensureSignedIn: true });

  return children;
}
