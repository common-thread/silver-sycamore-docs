import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silver Sycamore Document Library",
  description: "Internal document management hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-[#24292e] text-white px-6 py-3">
              <a
                href="/"
                className="text-xl font-bold text-white no-underline hover:no-underline"
              >
                Silver Sycamore Document Library
              </a>
            </header>
            <nav className="bg-[#f1f3f5] border-b border-[#e1e4e8] px-6 py-2">
              <ul className="flex gap-6 list-none m-0 p-0">
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <a href="/clients">Clients</a>
                </li>
                <li>
                  <a href="/staff">Staff</a>
                </li>
                <li>
                  <a href="/operations">Operations</a>
                </li>
                <li>
                  <a href="/deliverables">Deliverables</a>
                </li>
                <li>
                  <a href="/catalog">Catalog</a>
                </li>
              </ul>
            </nav>
            <main className="flex-1 px-6 py-4">{children}</main>
            <footer className="bg-[#f6f8fa] border-t border-[#e1e4e8] px-6 py-3 text-[#586069] text-sm">
              © Silver Sycamore | Staff Only
            </footer>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
