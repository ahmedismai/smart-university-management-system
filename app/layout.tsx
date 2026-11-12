import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NextGen University of Bangladesh",
  description: "Smart University Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body 
        className={`${raleway.className} min-h-full bg-bg-base text-text-main selection:bg-secondary/30`}
        suppressHydrationWarning
      >
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
