import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fraunces, jakarta } from "@/lib/fonts";
import { themeScript } from "@/lib/inline-scripts";

export const metadata: Metadata = {
  title: { default: "Admissions dashboard", template: "%s · B&A admin" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0711" },
  ],
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-canvas text-fg">{children}</body>
    </html>
  );
}
