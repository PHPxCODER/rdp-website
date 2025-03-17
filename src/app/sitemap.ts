// import { docsConfig } from "@/config/docs";
import { seoConfig } from "@/config/seo";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const domain = headersList.get("host") as string;
  const protocol = "https";

  const pages = Object.values(seoConfig.pages).map((page) => ({
    url: `${protocol}://${domain}${page.url}`,
    lastModified: new Date(),
    priority: page.priority || seoConfig.default.priority,
  }));

    // ...docsConfig.mainNav.map((item) => ({
    //   url: `${protocol}://${domain}${item.href}`,
    //   lastModified: new Date(),
    //   priority: item.href === "/" ? 1.0 : 0.8, 
    // })),
    // ...docsConfig.sidebarNav.flatMap((category) =>
    //   category.items.map((item) => ({
    //     url: `${protocol}://${domain}${item.href}`,
    //     lastModified: new Date(),
    //     priority: 0.7,
    //   }))
    // ),
    // ...docsConfig.chartsNav.flatMap((category) =>
    //   category.items.map((item) => ({
    //     url: `${protocol}://${domain}${item.href}`,
    //     lastModified: new Date(),
    //     priority: 0.6,
    //   }))
    // ),
  // ];

  return pages;
}
