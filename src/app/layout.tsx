import type { Metadata } from "next";
import { Inter, GFS_Didot } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const gfsDidot = GFS_Didot({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gfs-didot",
});

export const metadata: Metadata = {
  title: "CivicNode AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${gfsDidot.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
