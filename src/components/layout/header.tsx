"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { UserMenu } from "@/components/auth/user-menu";
import { LanguageSelector } from "@/components/controls/language-selector";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { Link } from "@/i18n/routing";

/**
 * Shared app header with navigation and authentication UI.
 *
 * Layout (left to right):
 * - Back button (conditional) + Logo
 * - Theme toggle + Language selector
 * - Auth buttons (unauthenticated) OR User menu (authenticated)
 *
 * Best practices implemented:
 * - User avatar/menu positioned far right (industry standard)
 * - Clear visual hierarchy with proper spacing
 * - Responsive design with touch-friendly targets
 * - Accessible keyboard navigation and ARIA labels
 * - Consistent with modern app patterns
 */
export function Header() {
  const t = useTranslations();

  return (
    <header className="glass sticky top-0 z-50 border-b bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Left: Back button + Logo */}
        <div className="flex items-center gap-3">
          <Link
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            href="/"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="hidden font-mono font-semibold text-lg sm:inline-block">
              {t("home.title")}
            </span>
          </Link>
        </div>

        {/* Right: Settings + Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSelector />

          {/* Auth UI - changes based on authentication state */}
          <div className="flex items-center">
            <Unauthenticated>
              <AuthButtons />
            </Unauthenticated>
            <Authenticated>
              <UserMenu />
            </Authenticated>
          </div>
        </div>
      </div>
    </header>
  );
}
