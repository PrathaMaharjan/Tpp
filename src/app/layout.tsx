import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClinicJsonLd from "./components/ClinicJsonLd";
import SocialWidget from "./components/SocialWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Nohemi — display face for hero headings, shared with skillshikshya site. */
const nohemi = localFont({
  src: [
    { path: "./fonts/Nohemi-Regular.ttf", weight: "400" },
    { path: "./fonts/Nohemi-Medium.ttf", weight: "500" },
    { path: "./fonts/Nohemi-SemiBold.ttf", weight: "600" },
    { path: "./fonts/Nohemi-Bold.ttf", weight: "700" },
    { path: "./fonts/Nohemi-ExtraBold.ttf", weight: "800" },
  ],
  variable: "--font-nohemi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tppcare.com"
  ),
  title: {
    default: "Texas Primary & Pediatric Care | Irving & Celina, TX",
    template: "%s | Texas Primary & Pediatric Care",
  },
  description:
    "Family medicine and pediatric care in Irving and Celina, Texas. Same-day appointments, most major insurance accepted. Call 469-442-0202.",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Texas Primary & Pediatric Care",
    title: "Texas Primary & Pediatric Care | Irving & Celina, TX",
    description:
      "Family medicine and pediatric care in Irving and Celina, Texas. Same-day appointments, most major insurance accepted.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nohemi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClinicJsonLd />
        {children}
        <SocialWidget />
      </body>
    </html>
  );
}
