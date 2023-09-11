import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

const ibmPlex = IBM_Plex_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "Novella",
  description: "Library management service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Always set the the theme to dark mode
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body className={`${ibmPlex.className} min-h-screen bg-surface-100`}>
        {children}
      </body>
    </html>
  );
}
