import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "./components/BottomNav";
import { SkipLink } from "./components/SkipLink";
import { ThemeProvider } from "./components/ThemeProvider";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F1 Tracker",
  description: "Track Formula 1 races, driver standings, and season calendar",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--background) min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider>
          <SkipLink />
          <div className="pb-20" id="main-content" role="main">
            {children}
            <Analytics />
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
