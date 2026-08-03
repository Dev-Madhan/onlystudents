import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://only-student.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/courses/*"],
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/api/*",
          "/payment/*",
          "/not-admin",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
