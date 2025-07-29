import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "A Universe of Messages for Husaina",
  description:
    "An interactive solar system where each planet holds a special message.",
  keywords: [
    "Solar System",
    "Messages",
    "Interactive",
    "Three.js",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Your Name Here" }],
  openGraph: {
    title: "A Universe of Messages for Husaina",
    description:
      "An interactive solar system where each planet holds a special message.",
    url: "https://your-domain.com", // Replace with your actual URL
    siteName: "Messages from the Heart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Universe of Messages for Husaina",
    description:
      "An interactive solar system where each planet holds a special message.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
