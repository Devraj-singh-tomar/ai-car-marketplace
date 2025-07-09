import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ImageKitProvider } from "@imagekit/next";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car Marketplace",
  description: "Find your dream car",
  icons: "/car.png",
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
        <ThemeProvider attribute={"class"}>
          <ImageKitProvider urlEndpoint="https://ik.imagekit.io/qmuhu58mj">
            <Header />
            {children}

            <Toaster closeButton />
          </ImageKitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
