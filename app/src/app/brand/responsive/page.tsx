"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "@/components/brand/brand.module.css";
import { LogoIcon } from "@/components/Logo";

export default function ResponsivePage() {
    return (
        <div className={styles.page}>
            {/* Standardized Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroLogo} style={{ width: 'auto' }}>
                        <div className="bg-paper border border-border rounded-lg p-4 shadow-sm text-ink-muted">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className={styles.heroContent}>
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <Breadcrumb />
                        </div>
                        <h1 className={styles.heroTitle}>Responsive Guidelines</h1>
                        <p className={styles.heroSubtitle}>
                            Breakpoints and layout rules for multi-device support. We follow a strict mobile-first approach.
                        </p>
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Tailwind 4 Defaults</span>
                        <h2 className={styles.sectionTitle}>Breakpoints</h2>
                        <p className={styles.sectionDescription}>
                            All layout properties should be defined for mobile first (default),
                            then overridden for larger screens using these prefixes.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] items-center gap-4 p-4 border border-border rounded-lg bg-paper">
                            <span className="font-mono font-bold text-ink">sm</span>
                            <span className="font-mono text-ink-muted">640px</span>
                            <span className="text-sm text-ink-light">Mobile Landscape / Small Tablets</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] items-center gap-4 p-4 border border-border rounded-lg bg-paper">
                            <span className="font-mono font-bold text-ink">md</span>
                            <span className="font-mono text-ink-muted">768px</span>
                            <span className="text-sm text-ink-light">Tablets / Portrait iPads</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] items-center gap-4 p-4 border border-border rounded-lg bg-paper">
                            <span className="font-mono font-bold text-ink">lg</span>
                            <span className="font-mono text-ink-muted">1024px</span>
                            <span className="text-sm text-ink-light">Laptops / Landscape Tablets</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] items-center gap-4 p-4 border border-border rounded-lg bg-paper">
                            <span className="font-mono font-bold text-ink">xl</span>
                            <span className="font-mono text-ink-muted">1280px</span>
                            <span className="text-sm text-ink-light">Desktops</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] items-center gap-4 p-4 border border-border rounded-lg bg-paper">
                            <span className="font-mono font-bold text-ink">2xl</span>
                            <span className="font-mono text-ink-muted">1536px</span>
                            <span className="text-sm text-ink-light">Large Screens / Monitors</span>
                        </div>
                    </div>
                </section>

                <section className={styles.section} style={{ paddingTop: 0 }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Grid Adaptations</span>
                        <h2 className={styles.sectionTitle}>Layout Behavior</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="font-display text-lg font-bold text-ink">1. Stacking</h3>
                            <p className="text-ink-light leading-relaxed">
                                Columns typically stack vertically on mobile. Use <code>grid-cols-1</code> by default,
                                and expand to <code>md:grid-cols-2</code> or <code>lg:grid-cols-3</code> as space permits.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-display text-lg font-bold text-ink">2. Padding & Spacing</h3>
                            <p className="text-ink-light leading-relaxed">
                                Reduce outer margins on mobile to maximize content area.
                                Example: <code>px-4</code> on mobile, <code>md:px-8</code> on tablets, <code>lg:px-12</code> on large screens.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-display text-lg font-bold text-ink">3. Typography Scaling</h3>
                            <p className="text-ink-light leading-relaxed">
                                Headings should scale down on mobile to prevent wrapping and excessive height.
                                Use appropriate <code>text-xl md:text-2xl lg:text-3xl</code> scaling classes.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
