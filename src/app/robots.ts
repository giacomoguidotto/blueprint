import type { MetadataRoute } from "next";

const BASE_URL = "https://blueprint.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/en", "/it", "/en/sign-in", "/en/sign-up", "/it/sign-in", "/it/sign-up"],
      disallow: ["/*/tasks", "/*/settings", "/callback"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
