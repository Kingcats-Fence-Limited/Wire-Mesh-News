import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wire Mesh News",
    short_name: "Wire Mesh News",
    description: "Independent news, markets and standards for the global wire mesh industry",
    start_url: "/",
    display: "browser",
    background_color: "#FFFFFF",
    theme_color: "#15161C",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
