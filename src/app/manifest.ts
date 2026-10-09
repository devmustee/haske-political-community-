import type { MetadataRoute } from "next";

// Brand primary (--primary, oklch(0.28 0.085 152)) as hex for OS chrome.
const BRAND_GREEN = "#0F4028";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Haske Community — Abdulrahman Bashir Haske",
    short_name: "Haske",
    description:
      "The official public platform of Abdulrahman Bashir Haske — record, agenda for Adamawa State, and the Haske public community.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND_GREEN,
    theme_color: BRAND_GREEN,
    categories: ["news", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Community", url: "/community", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Manifesto", url: "/manifesto", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Events", url: "/events", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
