import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://blueprint.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const publicRoutes = ["/", "/sign-in", "/sign-up"];

  return publicRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.5,
    }))
  );
}
