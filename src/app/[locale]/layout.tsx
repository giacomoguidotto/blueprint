import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "../../components/providers/convex-provider";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    en: "Prism",
    it: "Prism",
  };

  const descriptions: Record<Locale, string> = {
    en: "Your personal life management app",
    it: "La tua app di gestione della vita personale",
  };

  function getLocaleValue<T extends Record<Locale, string>>(
    obj: T,
    loc: Locale | string
  ): string {
    return obj[(loc in obj ? loc : "en") as Locale];
  }

  function getTitle(loc: Locale | string): string {
    return getLocaleValue(titles, loc);
  }

  function getDescription(loc: Locale | string): string {
    return getLocaleValue(descriptions, loc);
  }

  const baseUrl = "https://prism.guidotto.dev";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: getTitle(locale),
      template: "%s | Prism",
    },
    description: getDescription(locale),
    keywords: [
      "notes",
      "management",
      "colors",
      "collaboration",
      "project management",
      "planning",
      "productivity",
    ],
    authors: [{ name: "Giacomo Guidotto" }],
    creator: "Giacomo Guidotto",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${baseUrl}/${locale}`])
      ),
    },
    openGraph: {
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      alternateLocale: locale === "it" ? "en_US" : "it_IT",
      siteName: "Prism",
      title: getTitle(locale),
      description: getDescription(locale),
    },
    robots: {
      index: true,
      follow: true,
    },
  } satisfies Metadata;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
