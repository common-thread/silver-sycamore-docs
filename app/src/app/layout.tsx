import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { LogoPlaceholder } from "@/components/LogoPlaceholder";
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConvexClientProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header with logo */}
            <header
              className="px-8 py-5"
              style={{
                background: "var(--color-white)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <a
                href="/"
                className="flex items-center gap-4 no-underline hover:no-underline"
                style={{ color: "var(--color-ink)" }}
              >
                <LogoPlaceholder />
              </a>
            </header>

            {/* Navigation */}
            <nav
              className="px-8 py-3"
              style={{
                background: "var(--color-cream-dark)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <ul className="flex gap-8 list-none m-0 p-0">
                <li>
                  <a
                    href="/"
                    className="text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/clients"
                    className="text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Clients
                  </a>
                </li>
                <li>
                  <a
                    href="/staff"
                    className="text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Staff
                  </a>
                </li>
                <li>
                  <a
                    href="/operations"
                    className="text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Operations
                  </a>
                </li>
                <li>
                  <a
                    href="/deliverables"
                    className="text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Deliverables
                  </a>
                </li>
              </ul>
            </nav>

            {/* Main content */}
            <main className="flex-1 px-8 py-6">{children}</main>

            {/* Footer */}
            <footer
              className="px-8 py-4 text-sm"
              style={{
                background: "var(--color-cream-dark)",
                borderTop: "1px solid var(--color-border)",
                color: "var(--color-ink-muted)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.02em",
              }}
            >
              Silver Sycamore &middot; Staff Portal
            </footer>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
