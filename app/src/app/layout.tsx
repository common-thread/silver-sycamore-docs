// CONNECTOR: forms builder routes - restore from feature/full-v1
// Original location: app/src/app/forms/

import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silver Sycamore Dashboard",
  description: "Internal documentation hub for Silver Sycamore staff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConvexClientProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded"
          >
            Skip to main content
          </a>
          <div className="min-h-screen flex flex-col">
            <Header />

            {/* Main content */}
            <main
              id="main-content"
              className="flex-1"
              tabIndex={-1}
              style={{
                padding: "2rem",
                maxWidth: "1200px",
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {children}
            </main>

            {/* Footer - minimal */}
            <footer
              style={{
                padding: "1rem 2rem",
                borderTop: "1px solid var(--color-border)",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
                letterSpacing: "0.02em",
              }}
            >
              Silver Sycamore Staff Hub
            </footer>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
