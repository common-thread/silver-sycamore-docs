"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "@/components/brand/brand.module.css";
import Badge from "@/components/ui/Badge";

// WCAG 2.1 AA requirements checklist
const WCAG_CHECKLIST = [
  {
    category: "Perceivable",
    items: [
      { id: "1.1", name: "Text Alternatives", description: "All non-text content has text alternatives", status: "pass" },
      { id: "1.2", name: "Time-based Media", description: "Captions and audio descriptions for video", status: "na" },
      { id: "1.3", name: "Adaptable", description: "Content can be presented without losing information", status: "pass" },
      { id: "1.4.3", name: "Contrast (Minimum)", description: "4.5:1 for normal text, 3:1 for large text", status: "pass" },
      { id: "1.4.4", name: "Resize Text", description: "Text resizable to 200% without loss", status: "pass" },
      { id: "1.4.11", name: "Non-text Contrast", description: "3:1 for UI components and graphics", status: "pass" },
    ],
  },
  {
    category: "Operable",
    items: [
      { id: "2.1", name: "Keyboard Accessible", description: "All functionality available via keyboard", status: "pass" },
      { id: "2.2", name: "Enough Time", description: "Users can extend time limits", status: "pass" },
      { id: "2.3", name: "Seizures", description: "No flashing content above thresholds", status: "pass" },
      { id: "2.4.3", name: "Focus Order", description: "Logical, meaningful focus sequence", status: "pass" },
      { id: "2.4.7", name: "Focus Visible", description: "Keyboard focus indicator visible", status: "pass" },
      { id: "2.5", name: "Input Modalities", description: "Multiple ways to operate functionality", status: "pass" },
    ],
  },
  {
    category: "Understandable",
    items: [
      { id: "3.1", name: "Readable", description: "Language of page is programmatically set", status: "pass" },
      { id: "3.2.1", name: "On Focus", description: "Focus doesn't change context unexpectedly", status: "pass" },
      { id: "3.2.2", name: "On Input", description: "Input doesn't change context unexpectedly", status: "pass" },
      { id: "3.3.1", name: "Error Identification", description: "Errors are identified and described", status: "pass" },
      { id: "3.3.2", name: "Labels or Instructions", description: "Labels provided for user input", status: "pass" },
    ],
  },
  {
    category: "Robust",
    items: [
      { id: "4.1.1", name: "Parsing", description: "Valid HTML markup", status: "pass" },
      { id: "4.1.2", name: "Name, Role, Value", description: "UI components have accessible names", status: "pass" },
      { id: "4.1.3", name: "Status Messages", description: "Status messages announced to screen readers", status: "partial" },
    ],
  },
];

// Color contrast examples
const CONTRAST_EXAMPLES = [
  { bg: "var(--color-paper)", fg: "var(--color-ink)", ratio: "12.6:1", pass: true, usage: "Body text on paper" },
  { bg: "var(--color-paper)", fg: "var(--color-ink-light)", ratio: "6.8:1", pass: true, usage: "Secondary text" },
  { bg: "var(--color-paper)", fg: "var(--color-ink-muted)", ratio: "4.9:1", pass: true, usage: "Muted labels" },
  { bg: "var(--color-paper)", fg: "var(--color-champagne-deep)", ratio: "5.2:1", pass: true, usage: "Accent text" },
  { bg: "var(--color-champagne-deep)", fg: "var(--color-paper-white)", ratio: "5.2:1", pass: true, usage: "Button text" },
  { bg: "var(--color-paper-warm)", fg: "var(--color-ink)", ratio: "11.4:1", pass: true, usage: "Cards & sections" },
];

// Keyboard navigation patterns
const KEYBOARD_PATTERNS = [
  { key: "Tab", action: "Move focus to next interactive element" },
  { key: "Shift + Tab", action: "Move focus to previous interactive element" },
  { key: "Enter", action: "Activate buttons, links, and form submission" },
  { key: "Space", action: "Activate buttons, toggle checkboxes" },
  { key: "Arrow Keys", action: "Navigate within menus, tabs, and radio groups" },
  { key: "Escape", action: "Close modals, dropdowns, and cancel operations" },
  { key: "Home / End", action: "Jump to first/last item in lists" },
];

export default function AccessibilityPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <Breadcrumb />
            </div>
            <h1 className={styles.heroTitle}>Accessibility Guidelines</h1>
            <p className={styles.heroSubtitle}>
              Silver Sycamore Staff Hub is designed to meet WCAG 2.1 Level AA standards, ensuring
              usability for all team members regardless of ability.
            </p>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* Commitment Statement */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Our Commitment</span>
            <h2 className={styles.sectionTitle}>Accessibility First</h2>
            <p className={styles.sectionDescription}>
              Accessibility is not an afterthought—it's built into our design system from the ground up.
              Every component, color choice, and interaction is evaluated for inclusive design.
            </p>
          </div>

          <div className={styles.guidelinesGrid}>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Screen Readers</div>
              <p className={styles.guidelineText}>
                All content is accessible via screen readers. Semantic HTML and ARIA attributes ensure
                meaningful navigation and announcements.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Keyboard Navigation</div>
              <p className={styles.guidelineText}>
                Every feature is fully operable without a mouse. Focus states are clearly visible
                and follow a logical tab order.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Color Independence</div>
              <p className={styles.guidelineText}>
                Information is never conveyed by color alone. Icons, text, and patterns supplement
                color-coded status indicators.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Motion Sensitivity</div>
              <p className={styles.guidelineText}>
                Animations respect prefers-reduced-motion. Essential content never depends on
                animation to be understood.
              </p>
            </div>
          </div>
        </section>

        {/* WCAG Checklist */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Compliance</span>
            <h2 className={styles.sectionTitle}>WCAG 2.1 AA Checklist</h2>
            <p className={styles.sectionDescription}>
              Current compliance status against Web Content Accessibility Guidelines.
            </p>
          </div>

          <div style={{ display: "grid", gap: "var(--space-6)" }}>
            {WCAG_CHECKLIST.map((category) => (
              <div key={category.category}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--font-semibold)",
                  marginBottom: "var(--space-4)",
                  color: "var(--color-ink)",
                }}>
                  {category.category}
                </h3>
                <div style={{ display: "grid", gap: "var(--space-2)" }}>
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: "var(--space-4)",
                        alignItems: "center",
                        padding: "var(--space-3) var(--space-4)",
                        background: "var(--color-paper-white)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                        {item.id}
                      </span>
                      <div>
                        <div style={{ fontWeight: "var(--font-medium)", fontSize: "var(--text-sm)" }}>{item.name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-muted)" }}>{item.description}</div>
                      </div>
                      <Badge
                        variant={item.status === "pass" ? "success" : item.status === "partial" ? "warning" : "default"}
                        dot
                      >
                        {item.status === "pass" ? "Pass" : item.status === "partial" ? "Partial" : "N/A"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Color Contrast */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Visual</span>
            <h2 className={styles.sectionTitle}>Color Contrast Ratios</h2>
            <p className={styles.sectionDescription}>
              All text meets WCAG AA requirements: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px bold).
            </p>
          </div>

          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {CONTRAST_EXAMPLES.map((example, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto auto",
                  gap: "var(--space-4)",
                  alignItems: "center",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-paper-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 40,
                    background: example.bg,
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-semibold)",
                    color: example.fg,
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Aa
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)" }}>
                  {example.usage}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)" }}>
                  {example.ratio}
                </div>
                <Badge variant={example.pass ? "success" : "error"} dot>
                  {example.pass ? "AA" : "Fail"}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard Navigation */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Interaction</span>
            <h2 className={styles.sectionTitle}>Keyboard Navigation</h2>
            <p className={styles.sectionDescription}>
              Standard keyboard patterns used throughout the application.
            </p>
          </div>

          <div style={{
            background: "var(--color-paper-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}>
            {KEYBOARD_PATTERNS.map((pattern, index) => (
              <div
                key={pattern.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: "var(--space-4)",
                  alignItems: "center",
                  padding: "var(--space-4)",
                  borderBottom: index < KEYBOARD_PATTERNS.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
                }}
              >
                <kbd style={{
                  display: "inline-block",
                  padding: "var(--space-1) var(--space-2)",
                  background: "var(--color-paper-warm)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-sm)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}>
                  {pattern.key}
                </kbd>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)" }}>
                  {pattern.action}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Focus States */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Focus</span>
            <h2 className={styles.sectionTitle}>Focus Indicators</h2>
            <p className={styles.sectionDescription}>
              All interactive elements have visible focus states for keyboard navigation.
            </p>
          </div>

          <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  padding: "var(--space-3) var(--space-5)",
                  background: "var(--color-ink)",
                  color: "var(--color-paper-white)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  cursor: "pointer",
                  outline: "2px solid var(--color-champagne)",
                  outlineOffset: "2px",
                }}
              >
                Button (Focused)
              </button>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-muted)", marginTop: "var(--space-2)" }}>
                2px champagne outline
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <input
                type="text"
                placeholder="Input field"
                readOnly
                style={{
                  padding: "var(--space-3)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  outline: "2px solid var(--color-champagne)",
                  outlineOffset: "1px",
                }}
              />
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-muted)", marginTop: "var(--space-2)" }}>
                Ring on focus
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                  outline: "2px solid var(--color-champagne)",
                  outlineOffset: "2px",
                  borderRadius: "2px",
                  padding: "2px 4px",
                }}
              >
                Link (Focused)
              </a>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-muted)", marginTop: "var(--space-2)" }}>
                Visible outline
              </div>
            </div>
          </div>
        </section>

        {/* Testing Procedures */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Quality Assurance</span>
            <h2 className={styles.sectionTitle}>Testing Procedures</h2>
            <p className={styles.sectionDescription}>
              Recommended tools and processes for verifying accessibility compliance.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Automated Testing</div>
              <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", lineHeight: "var(--leading-relaxed)", paddingLeft: "var(--space-4)", margin: "var(--space-3) 0 0 0" }}>
                <li>Lighthouse accessibility audit (target: 90+)</li>
                <li>axe DevTools browser extension</li>
                <li>ESLint jsx-a11y plugin</li>
                <li>Pa11y CI for build pipeline</li>
              </ul>
            </div>

            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Manual Testing</div>
              <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", lineHeight: "var(--leading-relaxed)", paddingLeft: "var(--space-4)", margin: "var(--space-3) 0 0 0" }}>
                <li>Keyboard-only navigation test</li>
                <li>Screen reader testing (VoiceOver, NVDA)</li>
                <li>200% zoom usability check</li>
                <li>Color contrast verification</li>
              </ul>
            </div>

            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Screen Readers</div>
              <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", lineHeight: "var(--leading-relaxed)", paddingLeft: "var(--space-4)", margin: "var(--space-3) 0 0 0" }}>
                <li>macOS: VoiceOver (built-in)</li>
                <li>Windows: NVDA (free), JAWS</li>
                <li>iOS: VoiceOver (built-in)</li>
                <li>Android: TalkBack (built-in)</li>
              </ul>
            </div>

            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Browser Extensions</div>
              <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", lineHeight: "var(--leading-relaxed)", paddingLeft: "var(--space-4)", margin: "var(--space-3) 0 0 0" }}>
                <li>WAVE Evaluation Tool</li>
                <li>Color Contrast Analyzer</li>
                <li>HeadingsMap</li>
                <li>Accessibility Insights</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Implementation</span>
            <h2 className={styles.sectionTitle}>Code Patterns</h2>
          </div>

          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Icon Button with Label</div>
              <pre style={{
                background: "var(--color-paper-warm)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-mono)",
                overflow: "auto",
                marginTop: "var(--space-3)",
              }}>
{`<button aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>`}
              </pre>
            </div>

            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Form Field with Error</div>
              <pre style={{
                background: "var(--color-paper-warm)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-mono)",
                overflow: "auto",
                marginTop: "var(--space-3)",
              }}>
{`<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid="true"
/>
<span id="email-error" role="alert">
  Please enter a valid email
</span>`}
              </pre>
            </div>

            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Live Region for Status Updates</div>
              <pre style={{
                background: "var(--color-paper-warm)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-mono)",
                overflow: "auto",
                marginTop: "var(--space-3)",
              }}>
{`<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {successMessage && <span>{successMessage}</span>}
</div>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Learn More</span>
            <h2 className={styles.sectionTitle}>Resources</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-4)" }}>
            {[
              { title: "WCAG 2.1 Guidelines", url: "https://www.w3.org/WAI/WCAG21/quickref/", desc: "Official quick reference" },
              { title: "MDN Accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility", desc: "Web accessibility docs" },
              { title: "A11Y Project", url: "https://www.a11yproject.com/", desc: "Community-driven resource" },
              { title: "Inclusive Components", url: "https://inclusive-components.design/", desc: "Pattern library" },
            ].map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "var(--space-4)",
                  background: "var(--color-paper-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  transition: "all var(--duration-fast)",
                }}
              >
                <div style={{ fontWeight: "var(--font-semibold)", color: "var(--color-accent)", marginBottom: "var(--space-1)" }}>
                  {resource.title} ↗
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                  {resource.desc}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
