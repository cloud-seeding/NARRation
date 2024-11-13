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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-gray-900 border-b border-gray-700/50 px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <Link
                href="/"
                className="text-xl font-semibold text-gray-100 hover:text-emerald-400 transition-colors duration-150"
              >
                Project Cloud Seeding
              </Link>

              {/* Optional: Add header actions here */}
              <div className="flex items-center space-x-4">
                {/* You can add header icons/actions here */}
              </div>
            </div>
          </header>

          {/* Main content area with navigation */}
          <div className="flex flex-1">
            {/* Left Panel Navigation */}
            <Navigation />

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
