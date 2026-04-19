import type { MetadataRoute } from "next";

const base = "https://stellaroid-earn-demo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/app`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/proof`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/issuer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/issuer/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
