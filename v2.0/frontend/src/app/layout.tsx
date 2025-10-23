import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CleanNavigation } from "@/components/clean-navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Marketplace v2.0",
  description: "Enterprise-grade AI agent marketplace with 99.99% uptime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ backgroundColor: '#ffffff', color: '#000000', margin: '0', padding: '0' }}>
        <CleanNavigation />
        {children}
      </body>
    </html>
  );
}