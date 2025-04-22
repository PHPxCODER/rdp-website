import React from 'react'
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import SitemapPage from "./SitemapPage";

export const metadata: Metadata = {
    title: `Sitemap | ${siteConfig.name}`,
    description: "Navigate through all pages available on the RDP Datacenter website.",
  };

function page() {
  return (
    <SitemapPage />
  )
}

export default page