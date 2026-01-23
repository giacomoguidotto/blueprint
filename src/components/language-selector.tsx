"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/i18n/routing";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
};

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = (params.locale as Locale) || routing.defaultLocale;

  function handleLocaleChange(newLocale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <label className="sr-only" htmlFor="language-selector">
        Select language
      </label>
      <div className="relative">
        <select
          aria-label="Select language"
          disabled={isPending}
          id="language-selector"
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
          value={currentLocale}
        >
          {routing.locales.map((locale) => (
            <option key={locale} value={locale}>
              {LOCALE_NAMES[locale]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
