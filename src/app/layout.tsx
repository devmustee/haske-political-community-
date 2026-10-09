import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

// Self-hosted (not next/font/google): Vercel's Turbopack build image doesn't
// reliably resolve the google-font fetch helper for this Next.js version,
// which breaks production builds there even though local `next build` works
// fine. Self-hosting the same variable-font files sidesteps that entirely —
// see src/app/fonts/README.md.
const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const fraunces = localFont({
  src: "./fonts/Fraunces-Variable.woff2",
  variable: "--font-fraunces",
  weight: "400 700",
  display: "swap",
});

// `||` (not `??`) deliberately — Vercel projects sometimes have this env var
// present but set to an empty string rather than unset, and `??` only falls
// back on null/undefined, so `new URL("")` below would still throw.
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Haske Community — Abdulrahman Bashir Haske",
    template: "%s | Haske Community",
  },
  description:
    "The official public platform of Abdulrahman Bashir Haske — biography, documented record, proposed agenda for Adamawa State, and the Haske public community.",
  openGraph: {
    type: "website",
    siteName: "Haske Community",
    title: "Haske Community — Abdulrahman Bashir Haske",
    description:
      "Learn Haske's record, understand his agenda, and join the public conversation shaping Adamawa's future.",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Installed (home-screen) behaviour on iOS; Android reads app/manifest.ts.
  appleWebApp: {
    capable: true,
    title: "Haske",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F4028",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
