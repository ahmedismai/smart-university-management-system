import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "NextGen University of Bangladesh",
    short_name: "NGU",
    description: "Smart University Management System",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#0F2E5D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Student Portal", url: "/student", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Teacher Portal", url: "/teacher", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
