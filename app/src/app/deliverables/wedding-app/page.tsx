import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function WeddingAppPage() {
  return (
    <>
      <Breadcrumb documentTitle="Wedding App" />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "var(--space-6)" }}>
        <header style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              margin: 0
            }}>
              Wedding App
            </h1>
            <Badge variant="success" dot>Live</Badge>
          </div>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "var(--text-lg)", margin: 0 }}>
            Client-facing wedding planning portal
          </p>
        </header>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {/* Overview */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>What the Wedding App does</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0, lineHeight: "var(--leading-relaxed)" }}>
                The Wedding App is an interactive client-facing portal designed for engaged couples
                exploring Silver Sycamore as their wedding venue. It provides comprehensive information
                about our venue spaces, wedding packages, frequently asked questions, and planning
                resources to help couples envision and plan their perfect day.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Key capabilities of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: "grid", gap: "var(--space-4)" }}>
                <div style={{
                  padding: "var(--space-4)",
                  backgroundColor: "var(--color-paper-warm)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)"
                }}>
                  <h4 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-base)",
                    margin: "0 0 var(--space-2) 0",
                    color: "var(--color-ink)"
                  }}>
                    Interactive Venue Gallery
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    High-quality photo galleries showcasing our ceremony and reception spaces,
                    allowing couples to explore the venue from anywhere.
                  </p>
                </div>

                <div style={{
                  padding: "var(--space-4)",
                  backgroundColor: "var(--color-paper-warm)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)"
                }}>
                  <h4 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-base)",
                    margin: "0 0 var(--space-2) 0",
                    color: "var(--color-ink)"
                  }}>
                    Package Comparison
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    Side-by-side comparison of wedding packages with pricing, inclusions,
                    and customization options to help couples find their perfect fit.
                  </p>
                </div>

                <div style={{
                  padding: "var(--space-4)",
                  backgroundColor: "var(--color-paper-warm)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)"
                }}>
                  <h4 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-base)",
                    margin: "0 0 var(--space-2) 0",
                    color: "var(--color-ink)"
                  }}>
                    Timeline Builder
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    Interactive tool for creating and visualizing wedding day timelines,
                    from ceremony to reception and everything in between.
                  </p>
                </div>

                <div style={{
                  padding: "var(--space-4)",
                  backgroundColor: "var(--color-paper-warm)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)"
                }}>
                  <h4 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-base)",
                    margin: "0 0 var(--space-2) 0",
                    color: "var(--color-ink)"
                  }}>
                    Vendor Recommendations
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    Curated list of preferred vendors including photographers, florists,
                    DJs, and other wedding professionals who know our venue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>Technologies powering the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                <Badge variant="default">Next.js</Badge>
                <Badge variant="default">React</Badge>
                <Badge variant="default">TypeScript</Badge>
                <Badge variant="default">Tailwind CSS</Badge>
                <Badge variant="default">Vercel</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Access the application and related resources</CardDescription>
            </CardHeader>
            <CardFooter>
              <a
                href="https://silver-sycamore-wedding.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open App
              </a>
              <Link href="/brand/wedding-app" className="btn btn-secondary btn-sm">
                Style Guide
              </Link>
              <Link href="/deliverables" className="btn btn-ghost btn-sm">
                All Deliverables
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
