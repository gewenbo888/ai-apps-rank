import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aiapps.psyverse.fun"),
  title: "AI Apps · Ranked | AI 应用排行榜",
  description:
    "ChatGPT, Claude, Cursor, Notion AI, Figma AI, Midjourney, Suno, NotebookLM, and 30+ more — ranked on 7 weighted criteria with a Value Score (performance ÷ price). 🏆 marks the best-value picks. Bilingual EN + 中文.",
  keywords: ["AI apps", "AI tools ranking", "ChatGPT", "Claude", "Cursor", "Notion AI", "Figma AI", "Midjourney", "Suno", "NotebookLM", "best AI tools", "AI value score", "AI 应用排行", "AI 工具对比", "性价比 AI"],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "AI Apps · Ranked" }],
    title: "AI Apps · Ranked",
    description: "40+ AI tools scored on 7 criteria, with Value Score and 🏆 best-value picks. 中英双语。",
    url: "https://aiapps.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "AI Apps · Ranked",
    description: "40+ AI tools scored on 7 criteria with Value Score & 🏆 picks.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0a0908" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
