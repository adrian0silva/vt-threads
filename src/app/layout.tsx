import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Special_Elite } from "next/font/google";

import { ForumSidebar } from "@/components/forum-sidebar";
import { PresencePing } from "@/components/presence-ping";
import { SiteHeader } from "@/components/site-header";
import { SkinProvider } from "@/components/skin-provider";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-principia",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VT Forums",
  description: "Forum brasileiro de discussão",
  icons: { icon: "/eris-apple.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${specialElite.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem("vt-threads-skin");if(s==="principia")document.documentElement.classList.add("theme-principia");})();`,
          }}
        />
        <PresencePing />
        <SkinProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <ForumSidebar />
            <SidebarInset>
              <SiteHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
        </SkinProvider>
      </body>
    </html>
  );
}
