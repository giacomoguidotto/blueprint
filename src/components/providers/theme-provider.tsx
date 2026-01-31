"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  serverTheme?: string;
}

function ThemeCookieSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) {
      return;
    }

    if ("cookieStore" in window) {
      const oneYear = Date.now() + 365 * 24 * 60 * 60 * 1000;
      window.cookieStore.set({
        name: "theme",
        value: resolvedTheme,
        path: "/",
        expires: oneYear,
        sameSite: "lax",
      });
    } else {
      // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without Cookie Store API
      document.cookie = `theme=${resolvedTheme};path=/;max-age=31536000;samesite=lax`;
    }
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children, serverTheme }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={serverTheme ?? "system"}
      enableSystem
      storageKey="theme"
    >
      <ThemeCookieSync />
      {children}
    </NextThemesProvider>
  );
}
