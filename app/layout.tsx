import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import React from "react";
import {ThemeProvider} from "@/components/ui/theme-provider";
import {Toaster} from "@/components/ui/sonner";


const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Only Students",
  description: "A Perfect LMS platform for learning a new skill",
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
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          {children}
          <Toaster />
      </ThemeProvider>
      </body>
    </html>
  );
}
