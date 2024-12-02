import type { Metadata } from "next";
import "./globals.css";

import { Dai_Banna_SIL } from "next/font/google";
import { NewsProvider } from "./state/news-provider";

const daiBanna = Dai_Banna_SIL({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dai-banna",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NewsProvider>
        <body className={`${daiBanna.variable} antialiased`}>
          {children}
        </body>
      </NewsProvider>
    </html>
  );
}
