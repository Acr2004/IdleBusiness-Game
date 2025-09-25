import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { MoneyProvider } from "@/contexts/MoneyContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ConvexClientProvider } from "@/contexts/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Game",
  description: "A Idle Business Game for you to play",
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
        <ConvexClientProvider>
          <BusinessProvider>
            <MoneyProvider>
              <main className="flex">
                <Sidebar />

                {children}
              </main>
            </MoneyProvider>
          </BusinessProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
