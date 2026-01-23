"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "@/components/brand/brand.module.css";
import { useState } from "react";

// Duration tokens matching globals.css
const DURATION_TOKENS = [
  { name: "Fast", token: "--duration-fast", value: "100ms", usage: "Micro-interactions, hover states" },
  { name: "Normal", token: "--duration-normal", value: "200ms", usage: "Standard transitions, buttons" },
  { name: "Slow", token: "--duration-slow", value: "300ms", usage: "Page transitions, modals" },
  { name: "Slower", token: "--duration-slower", value: "500ms", usage: "Complex animations, loading" },
];

// Easing tokens
const EASING_TOKENS = [
  { name: "Default", token: "--ease-default", value: "cubic-bezier(0.4, 0, 0.2, 1)", description: "Standard easing for most animations" },
  { name: "In", token: "--ease-in", value: "cubic-bezier(0.4, 0, 1, 1)", description: "Elements entering/accelerating" },
  { name: "Out", token: "--ease-out", value: "cubic-bezier(0, 0, 0.2, 1)", description: "Elements exiting/decelerating" },
  { name: "In-Out", token: "--ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)", description: "Symmetric entrance and exit" },
  { name: "Linear", token: "--ease-linear", value: "linear", description: "Constant speed (spinners, progress)" },
];

// Animation examples
const ANIMATION_EXAMPLES = [
  {
    name: "Hover Lift",
    description: "Cards and interactive elements lift slightly on hover",
    cssProperty: "transform: translateY(-2px)",
    duration: "fast",
    easing: "default",
  },
  {
    name: "Fade In",
    description: "Content appearing on page load or modal open",
    cssProperty: "opacity: 0 → 1",
    duration: "normal",
    easing: "out",
  },
  {
    name: "Slide Down",
    description: "Dropdown menus and expanding sections",
    cssProperty: "transform: translateY(-8px) → translateY(0)",
    duration: "normal",
    easing: "out",
  },
  {
    name: "Scale In",
    description: "Modal dialogs and toast notifications",
    cssProperty: "transform: scale(0.95) → scale(1)",
    duration: "slow",
    easing: "out",
  },
];

export default function AnimationsPage() {
  const [playingAnimation, setPlayingAnimation] = useState<string | null>(null);

  const triggerAnimation = (name: string) => {
    setPlayingAnimation(name);
    setTimeout(() => setPlayingAnimation(null), 600);
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <Breadcrumb />
            </div>
            <h1 className={styles.heroTitle}>Motion Guidelines</h1>
            <p className={styles.heroSubtitle}>
              Subtle, purposeful animations that enhance usability without distraction. Motion should feel calm and professional.
            </p>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* Principles */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Philosophy</span>
            <h2 className={styles.sectionTitle}>Motion Principles</h2>
            <p className={styles.sectionDescription}>
              Our motion design reflects Silver Sycamore's editorial aesthetic: refined, unobtrusive, and purposeful.
            </p>
          </div>

          <div className={styles.guidelinesGrid}>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Purposeful</div>
              <p className={styles.guidelineText}>
                Every animation should have a clear purpose: guiding attention, confirming actions, or showing relationships between elements.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Subtle</div>
              <p className={styles.guidelineText}>
                Animations should enhance, not distract. Prefer gentle fades and small transforms over dramatic movements.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Quick</div>
              <p className={styles.guidelineText}>
                Fast transitions respect user time. Most interactions should complete within 200ms. Never make users wait for animations.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Accessible</div>
              <p className={styles.guidelineText}>
                Respect prefers-reduced-motion. Essential information must never depend on animation to be communicated.
              </p>
            </div>
          </div>
        </section>

        {/* Duration Tokens */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Timing</span>
            <h2 className={styles.sectionTitle}>Duration Tokens</h2>
            <p className={styles.sectionDescription}>
              Use consistent duration values across the application for cohesive motion.
            </p>
          </div>

          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {DURATION_TOKENS.map((token) => (
              <div
                key={token.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 120px 120px 1fr",
                  gap: "var(--space-4)",
                  alignItems: "center",
                  padding: "var(--space-4)",
                  background: "var(--color-paper-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ fontWeight: "var(--font-semibold)" }}>{token.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-ink-muted)" }}>
                  {token.value}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-ink-subtle)" }}>
                  {token.token}
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)" }}>
                  {token.usage}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Easing Curves */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Curves</span>
            <h2 className={styles.sectionTitle}>Easing Functions</h2>
            <p className={styles.sectionDescription}>
              Easing curves control the acceleration of animations. The default curve works for most cases.
            </p>
          </div>

          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {EASING_TOKENS.map((token) => (
              <div
                key={token.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr auto",
                  gap: "var(--space-4)",
                  alignItems: "center",
                  padding: "var(--space-4)",
                  background: "var(--color-paper-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ fontWeight: "var(--font-semibold)" }}>{token.name}</div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", marginBottom: "var(--space-1)" }}>
                    {token.description}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-ink-subtle)" }}>
                    {token.token}: {token.value}
                  </div>
                </div>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    background: "var(--color-paper-warm)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {/* Simple visual representation */}
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: "var(--color-champagne-deep)",
                      borderRadius: "50%",
                      animation: `moveDemo 2s ${token.value} infinite`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes moveDemo {
              0%, 100% { transform: translateX(-20px); }
              50% { transform: translateX(20px); }
            }
          `}</style>
        </section>

        {/* Interactive Examples */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Examples</span>
            <h2 className={styles.sectionTitle}>Common Patterns</h2>
            <p className={styles.sectionDescription}>
              Click each example to see the animation in action.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
            {/* Hover Lift Example */}
            <div
              style={{
                padding: "var(--space-6)",
                background: "var(--color-paper-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                transition: "transform 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontWeight: "var(--font-semibold)", marginBottom: "var(--space-2)" }}>Hover Lift</div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", marginBottom: "var(--space-3)" }}>
                Cards rise subtly on hover to indicate interactivity.
              </p>
              <code style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-ink-muted)" }}>
                duration-fast + ease-default
              </code>
            </div>

            {/* Fade In Example */}
            <button
              onClick={() => triggerAnimation("fade")}
              style={{
                padding: "var(--space-6)",
                background: "var(--color-paper-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontWeight: "var(--font-semibold)",
                  marginBottom: "var(--space-2)",
                  opacity: playingAnimation === "fade" ? 0 : 1,
                  animation: playingAnimation === "fade" ? "fadeInDemo 300ms ease-out forwards" : "none",
                }}
              >
                Fade In
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", marginBottom: "var(--space-3)" }}>
                Click to see content fade in smoothly.
              </p>
              <code style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-ink-muted)" }}>
                duration-slow + ease-out
              </code>
            </button>

            {/* Scale In Example */}
            <button
              onClick={() => triggerAnimation("scale")}
              style={{
                padding: "var(--space-6)",
                background: "var(--color-paper-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontWeight: "var(--font-semibold)",
                  marginBottom: "var(--space-2)",
                  transform: playingAnimation === "scale" ? "scale(0.9)" : "scale(1)",
                  animation: playingAnimation === "scale" ? "scaleInDemo 300ms ease-out forwards" : "none",
                }}
              >
                Scale In
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", marginBottom: "var(--space-3)" }}>
                Click to see modal-style scale animation.
              </p>
              <code style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-ink-muted)" }}>
                duration-slow + ease-out
              </code>
            </button>

            {/* Loading Spinner */}
            <div
              style={{
                padding: "var(--space-6)",
                background: "var(--color-paper-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ fontWeight: "var(--font-semibold)", marginBottom: "var(--space-2)" }}>Loading Spinner</div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-light)", marginBottom: "var(--space-3)" }}>
                Continuous rotation for loading states.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    border: "2px solid var(--color-border)",
                    borderTopColor: "var(--color-champagne-deep)",
                    borderRadius: "50%",
                    animation: "spin 800ms linear infinite",
                  }}
                />
                <code style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-ink-muted)" }}>
                  800ms + ease-linear
                </code>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes fadeInDemo {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleInDemo {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </section>

        {/* Do's and Don'ts */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Best Practices</span>
            <h2 className={styles.sectionTitle}>Do's and Don'ts</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
            <div style={{ background: "var(--color-success-light)", padding: "var(--space-5)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-success)" }}>
              <div style={{ fontWeight: "var(--font-semibold)", color: "var(--color-success-dark)", marginBottom: "var(--space-3)" }}>Do</div>
              <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)", lineHeight: "var(--leading-relaxed)", paddingLeft: "var(--space-4)", margin: 0 }}>
                <li>Use animations to provide feedback on user actions</li>
                <li>Keep transitions under 300ms for most interactions</li>
                <li>Animate properties that don't trigger layout (opacity, transform)</li>
                <li>Respect prefers-reduced-motion media query</li>
                <li>Test animations on lower-end devices</li>
              </ul>
            </div>

            <div style={{ background: "var(--color-error-light)", padding: "var(--space-5)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-error)" }}>
              <div style={{ fontWeight: "var(--font-semibold)", color: "var(--color-error-dark)", marginBottom: "var(--space-3)" }}>Don't</div>
              <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)", lineHeight: "var(--leading-relaxed)", paddingLeft: "var(--space-4)", margin: 0 }}>
                <li>Add animations just for decoration</li>
                <li>Block user interaction during animations</li>
                <li>Use bouncy or playful easing in professional contexts</li>
                <li>Animate large layout changes (use fade instead)</li>
                <li>Loop attention-grabbing animations indefinitely</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CSS Implementation */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Implementation</span>
            <h2 className={styles.sectionTitle}>Code Examples</h2>
          </div>

          <div className={styles.guidelineCard}>
            <div className={styles.guidelineTitle}>Standard Transition</div>
            <pre style={{
              background: "var(--color-paper-warm)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-mono)",
              overflow: "auto",
              marginTop: "var(--space-3)",
            }}>
{`.card {
  transition: transform var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}`}
            </pre>
          </div>

          <div className={styles.guidelineCard} style={{ marginTop: "var(--space-4)" }}>
            <div className={styles.guidelineTitle}>Reduced Motion Support</div>
            <pre style={{
              background: "var(--color-paper-warm)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-mono)",
              overflow: "auto",
              marginTop: "var(--space-3)",
            }}>
{`@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
