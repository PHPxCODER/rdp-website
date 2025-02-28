import { docsConfig } from "@/config/docs";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const domain = headersList.get("host") as string;
  const protocol = "https";

  const pages = [
    {
      url: `${protocol}://${domain}`,
      lastModified: new Date(),
      priority: 1.0, // Highest priority for home page
    },
    ...docsConfig.mainNav.map((item) => ({
      url: `${protocol}://${domain}${item.href}`,
      lastModified: new Date(),
      priority: item.href === "/" ? 1.0 : 0.8, 
    })),
    ...docsConfig.sidebarNav.flatMap((category) =>
      category.items.map((item) => ({
        url: `${protocol}://${domain}${item.href}`,
        lastModified: new Date(),
        priority: 0.7,
      }))
    ),
    ...docsConfig.chartsNav.flatMap((category) =>
      category.items.map((item) => ({
        url: `${protocol}://${domain}${item.href}`,
        lastModified: new Date(),
        priority: 0.6,
      }))
    ),
  ];

  return pages;
}
