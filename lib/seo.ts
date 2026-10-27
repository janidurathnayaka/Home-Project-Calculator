import type { Metadata } from "next";

export const SITE_NAME = "Home Project Calculator";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "Free home improvement calculators for painting, " +
  "flooring, tile, concrete, roofing, renovation " +
  "budgets and more. Estimate materials and costs.";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const url = new URL(normalizedPath, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}