import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Link from "next/link";

export default function BrandPage() {
  return (
    <>
      <Breadcrumb />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "var(--space-6)" }}>
        <header style={{ marginBottom: "var(--space-8)" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            marginBottom: "var(--space-2)"
          }}>
            Brand &amp; Style Guides
          </h1>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "var(--text-lg)" }}>
            Design systems and visual guidelines for Silver Sycamore applications.
          </p>
        </header>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {/* Staff Hub Brand Kit */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Staff Hub Brand Kit</CardTitle>
              <CardDescription>Core visual identity and design foundations for the Staff Hub</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                Comprehensive brand guidelines including logo usage, color palette, typography,
                and visual elements that define the Silver Sycamore Staff Hub identity.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/style-guide" className="btn btn-secondary btn-sm">
                View Brand Kit
              </Link>
            </CardFooter>
          </Card>

          {/* Staff Hub Components */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Staff Hub Components</CardTitle>
              <CardDescription>UI component library for the Staff Hub application</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                Reusable React components including buttons, inputs, cards, badges, and more.
                Built with the Staff Hub design system tokens.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/components" className="btn btn-secondary btn-sm">
                View Components
              </Link>
            </CardFooter>
          </Card>

          {/* Recipe App Style Guide */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Recipe App Style Guide</CardTitle>
              <CardDescription>Visual design guidelines for Pine Street Cafe recipes</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                Design documentation for the Recipe App, covering typography, colors, and
                layout patterns specific to the kitchen staff interface.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/brand/recipe-app" className="btn btn-secondary btn-sm">
                View Style Guide
              </Link>
              <a
                href="https://pine-street-cafe-recipes.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                Open App
              </a>
            </CardFooter>
          </Card>

          {/* Wedding App Style Guide */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Wedding App Style Guide</CardTitle>
              <CardDescription>Visual design guidelines for the client-facing wedding portal</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                Design documentation for the Wedding App, covering the elegant, client-facing
                aesthetic tailored for engaged couples exploring Silver Sycamore venues.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/brand/wedding-app" className="btn btn-secondary btn-sm">
                View Style Guide
              </Link>
              <a
                href="https://silver-sycamore-wedding.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                Open App
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
