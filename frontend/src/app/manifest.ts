import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stellaroid Earn",
    short_name: "Stellaroid",
    description:
      "Bind certificate hashes on-chain, verify credentials, and pay graduates directly on Stellar testnet.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#f59e0b",
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
