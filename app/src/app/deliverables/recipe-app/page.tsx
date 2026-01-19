import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function RecipeAppPage() {
  return (
    <>
      <Breadcrumb documentTitle="Recipe App" />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "var(--space-6)" }}>
        <header style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              margin: 0
            }}>
              Recipe App
            </h1>
            <Badge variant="success" dot>Live</Badge>
          </div>
          <p style={{ color: "var(--color-ink-muted)", fontSize: "var(--text-lg)", margin: 0 }}>
            Digital recipe management for catering operations
          </p>
        </header>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {/* Overview */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>What the Recipe App does</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ margin: 0, lineHeight: "var(--leading-relaxed)" }}>
                The Recipe App is a digital recipe management system built for Pine Street Cafe
                catering operations. It serves as the central repository for all recipes used in
                daily service and catering events, providing kitchen staff with quick access to
                standardized recipes, ingredient lists, and preparation instructions.
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
                    Recipe Database
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    Searchable collection of standardized recipes with detailed instructions,
                    ingredient lists, and prep times for consistent quality across all dishes.
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
                    Ingredient Scaling
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    Automatically scale recipes up or down based on serving counts,
                    perfect for catering events of any size from intimate dinners to large gatherings.
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
                    Dietary Filters
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    Filter recipes by dietary requirements including vegetarian, vegan,
                    gluten-free, dairy-free, and common allergens for easy menu planning.
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
                    Print Formatting
                  </h4>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                    Print-friendly recipe cards optimized for kitchen use, with clear
                    typography and layout designed for quick reference during prep and service.
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
                href="https://pine-street-cafe-recipes.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open App
              </a>
              <Link href="/brand/recipe-app" className="btn btn-secondary btn-sm">
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
