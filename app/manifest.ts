import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Only Students — Online Learning Platform",
    short_name: "Only Students",
    description:
      "A professional LMS platform for learning new skills through expert-led, interactive online courses.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    categories: ["education", "learning"],
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
