import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flips - AI Video Creator",
  description: "Create amazing videos with AI-powered transitions and effects",
  keywords:
    "video editing, AI video, transitions, video creator, automated video",
  authors: [{ name: "Flips Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
            },
            success: {
              style: {
                background: "#065f46",
                border: "1px solid #10b981",
              },
            },
            error: {
              style: {
                background: "#7f1d1d",
                border: "1px solid #ef4444",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
