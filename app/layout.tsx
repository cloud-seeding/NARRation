// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import Navigation from "./components/Navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Project Cloud Seeding",
  description: "Cloud Seeding Analysis Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-black border-b border-gray-200 px-4 py-3">
            <Link
              href="/"
              className="text-xl font-semibold hover:text-gray-600"
            >
              Project Cloud Seeding
            </Link>
          </header>

          {/* Main content area with navigation */}
          <div className="flex flex-1">
            {/* Left Panel Navigation */}
            <Navigation />

            {/* Main Content Area */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
