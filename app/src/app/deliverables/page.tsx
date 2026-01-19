import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function DeliverablesPage() {
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
            Deliverables
          </h1>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "var(--text-lg)" }}>
            Digital products and applications built for Silver Sycamore operations.
          </p>
        </header>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {/* Recipe App */}
          <Card variant="default">
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <CardTitle>Recipe App</CardTitle>
                <Badge variant="success" dot>Live</Badge>
              </div>
              <CardDescription>Digital recipe management system for Pine Street Cafe catering operations</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                Searchable recipe database with ingredient scaling, dietary filters, and print-friendly formatting.
                Used daily by kitchen staff for prep and service.
              </p>
            </CardContent>
            <CardFooter>
              <a
                href="https://pine-street-cafe-recipes.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open App →
              </a>
              <Link href="/deliverables/recipe-app" className="btn btn-ghost btn-sm">
                Documentation
              </Link>
            </CardFooter>
          </Card>

          {/* Wedding App */}
          <Card variant="default">
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <CardTitle>Wedding App</CardTitle>
                <Badge variant="success" dot>Live</Badge>
              </div>
              <CardDescription>Client-facing wedding planning and information portal</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                Interactive venue showcase, package details, FAQ, and planning resources for engaged couples.
                Includes ceremony timelines, vendor recommendations, and booking information.
              </p>
            </CardContent>
            <CardFooter>
              <a
                href="https://silver-sycamore-wedding.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open App →
              </a>
              <Link href="/deliverables/wedding-app" className="btn btn-ghost btn-sm">
                Documentation
              </Link>
            </CardFooter>
          </Card>

          {/* Staff Hub */}
          <Card variant="elevated">
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <CardTitle>Staff Hub</CardTitle>
                <Badge variant="accent" dot>You are here</Badge>
              </div>
              <CardDescription>Internal knowledge management and documentation wiki</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0 }}>
                Centralized repository for procedures, policies, forms, and operational documentation.
                Includes search, version history, personal workspaces, and team collaboration features.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/style-guide" className="btn btn-primary btn-sm">
                Style Guide
              </Link>
              <Link href="/components" className="btn btn-ghost btn-sm">
                Component Library
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
