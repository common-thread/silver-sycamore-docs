"use client";

import { LogoLockup } from "@/components/brand/LogoLockup";
import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "@/components/brand/brand.module.css";
import { LogoIcon } from "@/components/Logo";

export default function LogoStandardsPage() {
    return (
        <div className={styles.page}>
            {/* Standardized Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroLogo} style={{ width: 'auto' }}>
                        <LogoIcon size="lg" />
                    </div>
                    <div className={styles.heroContent}>
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <Breadcrumb categoryName="Brand" documentTitle="Logo Standards" />
                        </div>
                        <h1 className={styles.heroTitle}>Logo Standards</h1>
                        <p className={styles.heroSubtitle}>
                            Our logo system is built on a precise relationship between the Icon and the Wordmark.
                            Use these programmatic lockups to ensure consistent spacing and alignment across all applications.
                        </p>
                    </div>
                </div>
            </header>

            {/* Content Sections */}
            <div className={styles.container}>

                {/* Primary Lockup - Horizontal */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Primary Orientation</span>
                        <h2 className={styles.sectionTitle}>Horizontal Lockup</h2>
                        <p className={styles.sectionDescription}>
                            Use the horizontal lockup for headers, navigation bars, and left-aligned layouts.
                            The gap is strictly enforced at 12px (0.75rem) for standard sizes.
                        </p>
                    </div>

                    <div className={styles.logoShowcase}>
                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="horizontal" size="md" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Medium (Default)</div>
                                <div className={styles.logoUsage}>Standard navigation usage</div>
                            </div>
                        </div>

                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="horizontal" size="sm" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Small</div>
                                <div className={styles.logoUsage}>Compact headers</div>
                            </div>
                        </div>

                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="horizontal" size="lg" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Large</div>
                                <div className={styles.logoUsage}>Hero sections & splash screens</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stacked Lockup */}
                <section className={styles.section} style={{ paddingTop: 0 }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Vertical Orientation</span>
                        <h2 className={styles.sectionTitle}>Stacked Lockup</h2>
                        <p className={styles.sectionDescription}>
                            Use the stacked lockup for centered layouts, splash screens, or footers where vertical space is available.
                        </p>
                    </div>

                    <div className={styles.logoShowcase}>
                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="stacked" size="md" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Medium Stacked</div>
                            </div>
                        </div>

                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="stacked" size="sm" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Small Stacked</div>
                            </div>
                        </div>

                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="stacked" size="lg" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Large Stacked</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Context */}
                <section className={styles.section} style={{ paddingTop: 0 }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>System Architecture</span>
                        <h2 className={styles.sectionTitle}>Application Context</h2>
                        <p className={styles.sectionDescription}>
                            When branding a specific application, append the app name using the tag system.
                            This creates a consistent hierarchy: Brand (Primary) | Product (Secondary).
                        </p>
                    </div>

                    <div className={styles.logoShowcase}>
                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="horizontal" size="sm" showTag={true} tagText="Staff Hub" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Staff Hub</div>
                                <div className={styles.logoUsage}>Internal internal documentation platform</div>
                            </div>
                        </div>

                        <div className={styles.logoCard}>
                            <div className={styles.logoPreview}>
                                <LogoLockup variant="horizontal" size="sm" showTag={true} tagText="Recipe Book" />
                            </div>
                            <div className={styles.logoInfo}>
                                <div className={styles.logoName}>Recipe Book</div>
                                <div className={styles.logoUsage}>Kitchen display system</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
