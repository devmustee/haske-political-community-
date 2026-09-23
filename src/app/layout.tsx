import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
      </body>
    </html>
  );
}
