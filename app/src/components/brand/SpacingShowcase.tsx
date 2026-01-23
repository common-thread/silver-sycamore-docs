import { SpacingSample } from './BrandHelpers';
import styles from './brand.module.css';

export default function SpacingShowcase() {
    return (
        <section className={styles.section} data-bg="warm">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.eyebrow}>Layout</span>
                    <h2 className={styles.sectionTitle}>Spacing & Shadows</h2>
                    <p className={styles.sectionDescription}>
                        Consistent spacing scale and shadow depths for visual hierarchy.
                    </p>
                </div>

                <div className={styles.spacingShowcase}>
                    <h3 className={styles.subsectionTitle}>Spacing Scale</h3>
                    <div className={styles.spacingGrid}>
                        <SpacingSample size="4px" token="--space-1" />
                        <SpacingSample size="8px" token="--space-2" />
                        <SpacingSample size="12px" token="--space-3" />
                        <SpacingSample size="16px" token="--space-4" />
                        <SpacingSample size="24px" token="--space-6" />
                        <SpacingSample size="32px" token="--space-8" />
                        <SpacingSample size="48px" token="--space-12" />
                        <SpacingSample size="64px" token="--space-16" />
                    </div>
                </div>

                <div className={styles.shadowShowcase}>
                    <h3 className={styles.subsectionTitle}>Shadow Depths</h3>
                    <div className={styles.shadowGrid}>
                        <div className={styles.shadowSample} data-shadow="xs">
                            <span>XS</span>
                        </div>
                        <div className={styles.shadowSample} data-shadow="sm">
                            <span>SM</span>
                        </div>
                        <div className={styles.shadowSample} data-shadow="md">
                            <span>MD</span>
                        </div>
                        <div className={styles.shadowSample} data-shadow="lg">
                            <span>LG</span>
                        </div>
                        <div className={styles.shadowSample} data-shadow="xl">
                            <span>XL</span>
                        </div>
                        <div className={styles.shadowSample} data-shadow="champagne">
                            <span>Champagne</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
