import type { Metadata } from "next";
import "./globals.css";

import { Source_Serif_4 } from "next/font/google";
import { NewsProvider } from "@/state/news-provider";

import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { getCookie } from 'cookies-next';
import { cookies } from "next/headers";
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
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
  const cookieStore: any = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"
  return (
    // <ClerkProvider>
    
      <html lang="en" suppressHydrationWarning>
        <body className={`${sourceSerif.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {/* <SignedOut>
              <Login />
            </SignedOut>
            <SignedIn> */}
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarTrigger />
                <NewsProvider>
                  
                  {children}
                </NewsProvider>
              </SidebarProvider>
            {/* </SignedIn> */}
          </ThemeProvider>
        </body>
      </html>
    // </ClerkProvider>
  );
}
