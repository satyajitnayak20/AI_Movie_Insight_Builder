import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

// Display font — cinematic, editorial
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body font — clean, readable
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Mono font — for labels, codes
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movie Insight Builder — AI-Powered Film Analysis",
  description:
    "Enter any IMDb movie ID to get AI-powered audience sentiment analysis, cast details, ratings, and cinematic insights.",
  keywords: ["movie", "AI", "sentiment", "IMDb", "film analysis", "audience insights"],
  openGraph: {
    title: "Movie Insight Builder",
    description: "AI-powered movie sentiment analysis and audience insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-cinema-black antialiased">{children}</body>
    </html>
  );
}
