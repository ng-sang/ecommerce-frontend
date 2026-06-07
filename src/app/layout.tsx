import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header"; // Đã sửa đường dẫn ở đây
import { Suspense } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: " Store -  Điện thoại ",
  description:
    "Cửa hàng điện thoại tinh tế, sang trọng với trải nghiệm mua sắm hoàn hảo.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        <Suspense fallback={<div>Đang tải thanh công cụ...</div>}>
          <Header />
        </Suspense>
        <main className="flex-grow">{children}</main>
        <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
          © 2026 VIP STORE. Designed with Zen Spirit.
        </footer>
      </body>
    </html>
  );
}
