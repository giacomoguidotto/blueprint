"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

/**
 * Authentication buttons for unauthenticated users.
 *
 * Best practices:
 * - Sign Up is primary CTA (more prominent)
 * - Sign In is secondary (outline style)
 * - Buttons side-by-side on desktop
 * - Clear labels with good contrast
 * - Proper spacing for touch targets
 */
export function AuthButtons() {
  const t = useTranslations("common");

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link href="/sign-in">{t("signIn")}</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">{t("signUp")}</Link>
      </Button>
    </div>
  );
}
