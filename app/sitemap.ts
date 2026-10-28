
import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { calculators } from "@/lib/calculators";
import { guides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.siteUrl.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/calculators",
    "/guides",
    "/about",
    "/contact",
    "/assistant",
    "/convert",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
    })),

    ...calculators.map((calculator) => ({
      url: `${base}/calculators/${calculator.slug}`,
    })),

    ...guides.map((guide) => ({
      url: `${base}/guides/${guide.slug}`,
    })),
  ];
}
