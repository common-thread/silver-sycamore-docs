import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export default function WeddingAppStyleGuidePage() {
  return (
    <>
      <Breadcrumb />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "var(--space-6)" }}>
        <header style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ marginBottom: "var(--space-4)" }}>
            <Link
              href="/brand"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-ink-muted)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Brand
            </Link>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            marginBottom: "var(--space-2)"
          }}>
            Wedding App Style Guide
          </h1>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "var(--text-lg)" }}>
            Visual design documentation for the client-facing Wedding App.
          </p>
        </header>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {/* External App Link */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>View Live Application</CardTitle>
              <CardDescription>The Wedding App serves engaged couples exploring Silver Sycamore</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://silver-sycamore-wedding.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open Wedding App
              </a>
            </CardContent>
          </Card>

          {/* Client-Facing Considerations */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Client-Facing Design</CardTitle>
              <CardDescription>Tailored for engaged couples and their families</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0, marginBottom: "var(--space-4)" }}>
                As a client-facing application, the Wedding App has distinct styling needs compared
                to internal staff tools. The design prioritizes elegance, emotional resonance, and
                a premium feel that reflects the Silver Sycamore wedding experience.
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: "var(--space-6)",
                color: "var(--color-ink)",
                lineHeight: "var(--leading-relaxed)"
              }}>
                <li>Refined, romantic typography selections</li>
                <li>High-quality imagery showcasing venue spaces</li>
                <li>Smooth, elegant transitions and animations</li>
                <li>Mobile-first responsive design for on-the-go planning</li>
              </ul>
            </CardContent>
          </Card>

          {/* Design Notes */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Design Notes</CardTitle>
              <CardDescription>Key differences from the Staff Hub brand</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                While the Wedding App shares the Silver Sycamore brand DNA, it may employ different
                color temperatures, font pairings, and visual treatments to create the aspirational,
                celebration-focused atmosphere appropriate for couples planning their special day.
                The Staff Hub design system serves as a foundation, but client-facing materials have
                additional polish and emotional design considerations.
              </p>
            </CardContent>
          </Card>

          {/* Placeholder */}
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Detailed style documentation in development</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
                Full documentation including color tokens, typography scale, imagery guidelines,
                and component patterns will be added as the Wedding App design system is formalized.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
