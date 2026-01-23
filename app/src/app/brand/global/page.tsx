import { Breadcrumb } from "@/components/Breadcrumb";
import LogoShowcase from "@/components/brand/LogoShowcase";
import ColorPalette from "@/components/brand/ColorPalette";
import TypeScale from "@/components/brand/TypeScale";
import SpacingShowcase from "@/components/brand/SpacingShowcase";
import styles from "@/components/brand/brand.module.css";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { LogoIcon } from "@/components/Logo";

export default function GlobalBrandKitPage() {
    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroLogo} style={{ width: 'auto' }}>
                        <LogoLockup variant="horizontal" size="lg" />
                    </div>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle} style={{ marginTop: 'var(--space-4)' }}>Global Brand Kit</h1>
                        <p className={styles.heroSubtitle}>
                            The authoritative reference for our visual language.
                            These core elements—Logos, Colors, and Typography—define the brand across all applications.
                        </p>
                    </div>
                    <div className={styles.heroDivider} />
                </div>
            </header>

            <div style={{ padding: "var(--space-6) 0" }}>
                <div className={styles.container}>
                    <Breadcrumb />
                </div>
            </div>

            <LogoShowcase />
            <ColorPalette />
            <TypeScale />
            <SpacingShowcase />

            {/* Footer */}
            <footer style={{
                borderTop: "1px solid var(--color-border)",
                padding: "var(--space-10) 0",
                marginTop: "var(--space-16)",
                textAlign: "center"
            }}>
                <div className={styles.container}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)", color: "var(--color-ink-muted)", fontSize: "var(--text-sm)" }}>
                        <LogoIcon size="sm" />
                        <span>Silver Sycamore Brand System</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
