"use client";

import { CheckIcon, LanguagesIcon, LoaderCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/i18n/routing";
import {
  localeNativeName,
  routing,
  usePathname,
  useRouter,
} from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("intl");
  const [isPending, startTransition] = useTransition();

  const currentLocale = (params.locale as Locale) || routing.defaultLocale;

  function handleLocaleChange(newLocale: Locale) {
    if (newLocale === currentLocale) {
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Select language"
          className={cn("gap-2", className)}
          disabled={isPending}
          size="sm"
          variant="outline"
        >
          {isPending ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <LanguagesIcon />
          )}
          <span className="font-semibold">
            {localeNativeName[currentLocale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between gap-3"
            disabled={isPending}
            key={locale}
            onClick={() => handleLocaleChange(locale)}
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{localeNativeName[locale]}</span>
              <span className="text-muted-foreground text-xs">{t(locale)}</span>
            </div>
            {currentLocale === locale && <CheckIcon className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
