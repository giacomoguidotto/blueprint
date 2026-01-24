import { headers } from "next/headers";

/**
 * Get the CSP nonce for the current request
 *
 * Use this in Server Components to get the nonce for inline scripts/styles.
 * The nonce is generated per-request in proxy.ts for security.
 *
 * @example
 * ```tsx
 * import { getNonce } from "@/lib/security";
 *
 * export default async function Page() {
 *   const nonce = await getNonce();
 *   return (
 *     <Script
 *       src="https://www.googletagmanager.com/gtag/js"
 *       strategy="afterInteractive"
 *       nonce={nonce}
 *     />
 *   );
 * }
 * ```
 */
export async function getNonce(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get("x-nonce") ?? undefined;
}
