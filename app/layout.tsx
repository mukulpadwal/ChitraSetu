import type { Metadata } from "next";
import { Sirin_Stencil } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const sirinStencilSans = Sirin_Stencil({
  variable: "--font-sirin-stencil-sans",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChitraSetu",
  description: "Bridge the Gap Between Vision and Trade",
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
          <main className="min-h-screen bg-gradient-to-r from-gray-100 to-white p-6">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
