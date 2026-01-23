"use client";

import { LogoFull, LogoIcon, LogoText, LogoHorizontal } from '@/components/Logo';
import styles from './brand.module.css';

export default function LogoShowcase() {
    const handleDownload = (logo: string) => {
        // In a real app, this would point to a public asset URL
        // For now, we simulate finding the file
        const link = document.createElement('a');
        link.href = `/${logo}`;
        link.download = logo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.eyebrow}>Identity</span>
                    <h2 className={styles.sectionTitle}>Logo</h2>
                    <p className={styles.sectionDescription}>
                        The Silver Sycamore logo system consists of four variants. Follow these guidelines
                        to ensure consistent, professional brand presentation across all applications.
                    </p>
                </div>

                {/* Logo Variants */}
                <div className={styles.logoShowcase}>
                    <div className={styles.logoCard}>
                        <div className={styles.logoPreview}>
                            <LogoFull size="lg" />
                        </div>
                        <div className={styles.logoInfo}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 className={styles.logoName}>Full Logo</h3>
                                    <p className={styles.logoUsage}>Primary mark. Use when space permits and brand recognition is priority.</p>
                                </div>
                                <button
                                    onClick={() => handleDownload('logo-full.png')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)' }}
                                    title="Download PNG"
                                    aria-label="Download Full Logo as PNG"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.logoMeta}>
                                <span>Aspect: 1.5:1</span>
                                <span>Min height: 48px</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.logoCard}>
                        <div className={styles.logoPreview}>
                            <LogoIcon size="lg" />
                        </div>
                        <div className={styles.logoInfo}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 className={styles.logoName}>Icon Mark</h3>
                                    <p className={styles.logoUsage}>Secondary mark. Use for favicons, app icons, social avatars.</p>
                                </div>
                                <button
                                    onClick={() => handleDownload('logo-icon.png')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)' }}
                                    title="Download PNG"
                                    aria-label="Download Icon Mark as PNG"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.logoMeta}>
                                <span>Aspect: 2.13:1</span>
                                <span>Min height: 30px</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.logoCard}>
                        <div className={styles.logoPreview}>
                            <LogoText size="lg" />
                        </div>
                        <div className={styles.logoInfo}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 className={styles.logoName}>Wordmark</h3>
                                    <p className={styles.logoUsage}>Text-only variant. Use in horizontal layouts, footers, compact headers.</p>
                                </div>
                                <button
                                    onClick={() => handleDownload('logo-text.png')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)' }}
                                    title="Download PNG"
                                    aria-label="Download Wordmark as PNG"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.logoMeta}>
                                <span>Aspect: 5.9:1</span>
                                <span>Min height: 24px</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.logoCard} ${styles.logoCardWide}`}>
                        <div className={styles.logoPreviewWide}>
                            <LogoHorizontal size="lg" />
                        </div>
                        <div className={styles.logoInfo}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 className={styles.logoName}>Horizontal Lockup</h3>
                                    <p className={styles.logoUsage}>Icon + wordmark combined. Ideal for headers, navigation bars, and wide layouts.</p>
                                </div>
                                <button
                                    onClick={() => handleDownload('logo-horizontal.png')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)' }}
                                    title="Download PNG"
                                    aria-label="Download Horizontal Lockup as PNG"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.logoMeta}>
                                <span>Aspect: 5:1</span>
                                <span>Min height: 40px</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Guidelines */}
                <div className={styles.logoGuidelines}>
                    <h3 className={styles.subsectionTitle}>Usage Guidelines</h3>
                    <div className={styles.guidelinesGrid}>
                        <div className={styles.guidelineCard}>
                            <h4 className={styles.guidelineTitle}>Clear Space</h4>
                            <p className={styles.guidelineText}>
                                Maintain clear space equal to the height of the &ldquo;S&rdquo; in the wordmark on all sides.
                                Never place other elements within this exclusion zone.
                            </p>
                        </div>
                        <div className={styles.guidelineCard}>
                            <h4 className={styles.guidelineTitle}>Minimum Size</h4>
                            <p className={styles.guidelineText}>
                                Full logo: 48px height minimum. Wordmark: 24px height minimum.
                                Below these sizes, use the icon mark instead.
                            </p>
                        </div>
                        <div className={styles.guidelineCard}>
                            <h4 className={styles.guidelineTitle}>Background</h4>
                            <p className={styles.guidelineText}>
                                Use on light backgrounds only (paper-white through paper-warm).
                                Ensure sufficient contrast for legibility.
                            </p>
                        </div>
                        <div className={styles.guidelineCard}>
                            <h4 className={styles.guidelineTitle}>Prohibited</h4>
                            <p className={styles.guidelineText}>
                                Never stretch, rotate, add effects, change colors, or place on busy backgrounds.
                                Always use provided assets.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Context Examples */}
                <div className={styles.logoContexts}>
                    <h3 className={styles.subsectionTitle}>Context Examples</h3>
                    <div className={styles.contextGrid}>
                        <div className={styles.contextItem}>
                            <span className={styles.contextLabel}>Header (48px)</span>
                            <div className={styles.contextPreview}>
                                <LogoFull size="sm" />
                            </div>
                        </div>
                        <div className={styles.contextItem}>
                            <span className={styles.contextLabel}>Standard (80px)</span>
                            <div className={styles.contextPreview}>
                                <LogoFull size="md" />
                            </div>
                        </div>
                        <div className={styles.contextItem}>
                            <span className={styles.contextLabel}>Hero (120px)</span>
                            <div className={styles.contextPreview}>
                                <LogoFull size="lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
