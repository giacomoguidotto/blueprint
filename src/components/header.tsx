"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

/**
 * Shared app header with navigation.
 *
 * - Shows back button on nested routes (not on locale root)
 * - Always displays app logo, theme toggle, and language selector
 */
export function Header() {
  const t = useTranslations();
  const segments = useSelectedLayoutSegments();

  // Show back button if we're not at the locale root (e.g., /en/tasks has segments ["tasks"])
  const showBackButton = segments.length > 0;

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button asChild size="icon-sm" variant="ghost">
              <Link aria-label={t("common.back")} href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          )}
          <Link className="flex items-center gap-2" href="/">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">{t("home.title")}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
