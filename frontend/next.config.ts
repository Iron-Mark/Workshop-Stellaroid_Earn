import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Directives that are safe to send on every route.
const BASE_CSP_DIRECTIVES = [
  "default-src 'self'",
  // Next.js injects __NEXT_DATA__ as an inline <script> — unsafe-inline is
  // required until nonce-based CSP is wired up via middleware.
  // connect-src still limits what JS can actually fetch, which is the
  // most valuable XSS mitigation for a wallet dApp.
  // unsafe-eval is required in dev for React Fast Refresh (webpack HMR).
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  // IBM Plex Sans/Mono load as @import from Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Font files served from Google's CDN.
  "font-src 'self' https://fonts.gstatic.com",
  // QR codes are rendered as data: URIs; SVG assets come from /public.
  "img-src 'self' data: blob:",
  // All RPC calls go to the Stellar network only.
  "connect-src 'self' https://*.stellar.org",
  // This app does not embed external iframes.
  "frame-src 'none'",
  // No Flash, PDFs, or other plugins.
  "object-src 'none'",
  // Prevents <base> tag injection attacks.
  "base-uri 'self'",
  // Prevents forms from being redirected to third-party URLs.
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Prevent webpack from bundling native Node.js modules pulled in by
  // @stellar/stellar-sdk → @stellar/stellar-base → sodium-native.
  // Webpack can't statically analyse sodium-native's dynamic require() calls
  // for native .node binaries — marking them external silences the warnings
  // and lets Node resolve them at runtime instead.
  serverExternalPackages: ["sodium-native", "@stellar/stellar-sdk", "@stellar/stellar-base"],

  async headers() {
    return [
      {
        // Apply core security headers to every route.
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: BASE_CSP_DIRECTIVES },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            // Tell browsers to always use HTTPS for 2 years.
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // The /embed page is designed to be iframed.
        // CSP frame-ancestors takes precedence over X-Frame-Options in all
        // modern browsers, so the DENY header above won't block embedding.
        source: "/proof/:hash/embed",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
};

export default nextConfig;
