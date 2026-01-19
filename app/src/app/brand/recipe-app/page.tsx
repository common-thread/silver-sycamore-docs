import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export default function RecipeAppStyleGuidePage() {
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
            Recipe App Style Guide
          </h1>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "var(--text-lg)" }}>
            Visual design documentation for the Pine Street Cafe Recipe App.
          </p>
        </header>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {/* External App Link */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>View Live Application</CardTitle>
              <CardDescription>The Recipe App is deployed and actively used by kitchen staff</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://pine-street-cafe-recipes.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open Recipe App
              </a>
            </CardContent>
          </Card>

          {/* Design Foundation */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Design Foundation</CardTitle>
              <CardDescription>Built on the Silver Sycamore brand foundation</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0, marginBottom: "var(--space-4)" }}>
                The Recipe App shares core design principles with the Silver Sycamore brand system,
                including the warm color palette and editorial typography approach. However, it is
                optimized for quick scanning and use in a kitchen environment.
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: "var(--space-6)",
                color: "var(--color-ink)",
                lineHeight: "var(--leading-relaxed)"
              }}>
                <li>Clean, high-contrast typography for easy reading</li>
                <li>Print-friendly layouts for recipe cards</li>
                <li>Responsive design for tablet and desktop use</li>
                <li>Ingredient scaling with clear visual hierarchy</li>
              </ul>
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
                Full documentation including color tokens, typography scale, component patterns,
                and usage guidelines will be added as the Recipe App design system matures.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
