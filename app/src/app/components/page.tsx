"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ComponentShowcase() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Component Library</h1>
        <p style={{ color: "var(--color-ink-muted)", fontSize: "1.125rem" }}>
          Design system components for Silver Sycamore Staff Hub
        </p>
      </header>

      {/* Button Section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-border)" }}>
          Button
        </h2>

        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Variants</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Sizes</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>States</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary" disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
            <Button variant="ghost" disabled>Disabled Ghost</Button>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-border)" }}>
          Input
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          <div>
            <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Default Variant</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Input label="Full Name" placeholder="Enter your name" />
              <Input label="Email" placeholder="you@example.com" hint="We'll never share your email" />
              <Input label="Error State" placeholder="Enter value" error="This field is required" />
              <Input label="Disabled" placeholder="Cannot edit" disabled />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Filled Variant</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Input variant="filled" label="Search" placeholder="Search documents..." />
              <Input variant="filled" label="Notes" placeholder="Add notes here" hint="Optional field" />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Sizes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Input inputSize="sm" label="Small Input" placeholder="Small size" />
              <Input inputSize="md" label="Medium Input" placeholder="Medium size (default)" />
              <Input inputSize="lg" label="Large Input" placeholder="Large size" />
            </div>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-border)" }}>
          Card
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card with border and background</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the default card variant with subtle border styling, perfect for grouping related content.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="secondary">Learn More</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Card with shadow for emphasis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Elevated cards use shadow instead of borders, drawing more visual attention to the content.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="primary">Take Action</Button>
            </CardFooter>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>Minimal border, transparent background</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The outlined variant is more subtle, great for secondary content or nested cards.</p>
            </CardContent>
          </Card>

          <Card variant="elevated" interactive>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Hover and click effects enabled</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card responds to hover and focus states. Try hovering over it to see the effect.</p>
            </CardContent>
          </Card>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Padding Options</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
            <Card padding="sm" variant="outlined" style={{ flex: "0 0 auto" }}>
              <p style={{ margin: 0 }}>Small padding</p>
            </Card>
            <Card padding="md" variant="outlined" style={{ flex: "0 0 auto" }}>
              <p style={{ margin: 0 }}>Medium padding (default)</p>
            </Card>
            <Card padding="lg" variant="outlined" style={{ flex: "0 0 auto" }}>
              <p style={{ margin: 0 }}>Large padding</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Badge Section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-border)" }}>
          Badge
        </h2>

        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Variants</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="accent">Accent</Badge>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>With Status Dot</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Badge variant="default" dot>Pending</Badge>
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" dot>Review</Badge>
            <Badge variant="error" dot>Critical</Badge>
            <Badge variant="info" dot>Processing</Badge>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-ink-light)" }}>Sizes</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Badge size="sm" variant="success">Small</Badge>
            <Badge size="md" variant="success">Medium</Badge>
            <Badge size="sm" variant="accent" dot>Small with Dot</Badge>
            <Badge size="md" variant="accent" dot>Medium with Dot</Badge>
          </div>
        </div>
      </section>

      {/* Combined Example */}
      <section>
        <h2 style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-border)" }}>
          Combined Example
        </h2>

        <Card variant="elevated" style={{ maxWidth: "500px" }}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <CardTitle as="h3">Document Review</CardTitle>
              <Badge variant="warning" dot>Pending</Badge>
            </div>
            <CardDescription>Staff onboarding materials require your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              label="Review Notes"
              placeholder="Add any comments or feedback..."
              hint="Your notes will be visible to the document author"
            />
          </CardContent>
          <CardFooter>
            <Button variant="primary" size="sm">Approve</Button>
            <Button variant="ghost" size="sm">Request Changes</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
