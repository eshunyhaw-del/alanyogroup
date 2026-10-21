import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy for production. Next.js needs inline bootstrap scripts, so script-src allows
// 'unsafe-inline' (nonces would make every page dynamic). Everything else is locked down: no framing,
// no third-party scripts or frames, forms and connections only to this site, and no plugins.
// Customers are sent to Paystack by a navigation, which these rules allow; Paystack never loads inside our pages.
// Cloudflare Turnstile (optional human check on the contact form) is allowed only when it is configured.
const turnstile = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? " https://challenges.cloudflare.com" : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${turnstile}`,
  turnstile ? `frame-src${turnstile}` : "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  ...(isDev ? [] : [{ key: "Content-Security-Policy", value: csp }]),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // The Vercel services rewrite does not reach Next's /_next/image optimiser, so every <Image>
  // 404s. The photography in public/ is already resized and compressed, so serve it as is.
  images: { unoptimized: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Order pages carry a payment reference in the URL: keep them out of caches and search results.
      {
        source: "/order/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/checkout",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  // Locally the API runs on its own port. On Vercel the services config in vercel.json routes /api/*.
  async rewrites() {
    return isDev ? [{ source: "/api/:path*", destination: "http://127.0.0.1:8000/api/:path*" }] : [];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
