import { withAuth } from "@workos-inc/authkit-nextjs";
import type { ReactNode } from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await withAuth({ ensureSignedIn: true });
  return children;
}
