import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNativeName: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
