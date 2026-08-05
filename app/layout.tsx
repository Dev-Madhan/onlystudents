import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://only-student.vercel.app"),

  title: {
    default: "Only Students — Online Learning Platform",
    template: "%s | Only Students",
  },
  description:
    "Transform your educational journey with expert-led, interactive online courses. Access comprehensive courses in web development, design, and more — anytime, anywhere.",
  keywords: [
    "online courses",
    "LMS",
    "learning management system",
    "e-learning",
    "web development courses",
    "online education",
    "skill development",
    "interactive learning",
    "Only Students",
  ],
  authors: [{ name: "Only Students" }],
  creator: "Only Students",
  publisher: "Only Students",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Only Students",
    title: "Only Students — Online Learning Platform",
    description:
      "Transform your educational journey with expert-led, interactive online courses. Access comprehensive courses anytime, anywhere.",
    url: "https://only-student.vercel.app",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Only Students — Online Learning Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Only Students — Online Learning Platform",
    description:
      "Transform your educational journey with expert-led, interactive online courses.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },

  manifest: "/manifest.webmanifest",

  alternates: {
    canonical: "https://only-student.vercel.app",
  },

  verification: {
    google: "google828697e026d3d582",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bricolage.variable} antialiased`}
      >
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          {children}
          <Toaster closeButton position="bottom-right" />
      </ThemeProvider>
      </body>
    </html>
  );
}