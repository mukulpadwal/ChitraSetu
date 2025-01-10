import type { Metadata } from "next";
import { Sirin_Stencil } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sirinStencilSans = Sirin_Stencil({
  variable: "--font-sirin-stencil-sans",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapTrade",
  description: "Where Every Click Counts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sirinStencilSans.variable} antialiased`}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
