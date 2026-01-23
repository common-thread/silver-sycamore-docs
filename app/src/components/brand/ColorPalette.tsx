import { ColorSwatch } from './BrandHelpers';
import styles from './brand.module.css';

export default function ColorPalette() {
    return (
        <section className={styles.section} data-bg="warm">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.eyebrow}>Foundation</span>
                    <h2 className={styles.sectionTitle}>Color Palette</h2>
                    <p className={styles.sectionDescription}>
                        A sophisticated monochrome foundation anchored by warm blacks and creamy whites,
                        with champagne accents used sparingly for warmth and emphasis.
                    </p>
                </div>

                {/* Ink System */}
                <div className={styles.colorSection}>
                    <h3 className={styles.colorGroupTitle}>Ink System</h3>
                    <p className={styles.colorGroupDesc}>Text hierarchy with warm undertones.</p>
                    <div className={styles.colorGrid}>
                        <ColorSwatch name="Black" value="#0F0F0F" token="--color-ink-black" />
                        <ColorSwatch name="Ink" value="#1A1A1A" token="--color-ink" />
                        <ColorSwatch name="Dark" value="#2D2D2D" token="--color-ink-dark" />
                        <ColorSwatch name="Mid" value="#404040" token="--color-ink-mid" />
                        <ColorSwatch name="Light" value="#5C5C5C" token="--color-ink-light" />
                        <ColorSwatch name="Muted" value="#7A7A7A" token="--color-ink-muted" />
                        <ColorSwatch name="Subtle" value="#A0A0A0" token="--color-ink-subtle" />
                    </div>
                </div>

                {/* Paper System */}
                <div className={styles.colorSection}>
                    <h3 className={styles.colorGroupTitle}>Paper System</h3>
                    <p className={styles.colorGroupDesc}>Background layers with warm off-whites.</p>
                    <div className={styles.colorGrid}>
                        <ColorSwatch name="White" value="#FFFFFF" token="--color-paper-white" light />
                        <ColorSwatch name="Paper" value="#FAF9F7" token="--color-paper" light />
                        <ColorSwatch name="Warm" value="#F5F4F2" token="--color-paper-warm" light />
                        <ColorSwatch name="Mid" value="#E8E8E6" token="--color-paper-mid" light />
                        <ColorSwatch name="Dark" value="#D4D4D2" token="--color-paper-dark" light />
                    </div>
                </div>

                {/* Champagne Accents */}
                <div className={styles.colorSection}>
                    <h3 className={styles.colorGroupTitle}>Champagne Accents</h3>
                    <p className={styles.colorGroupDesc}>Warm golden tones for emphasis and interaction.</p>
                    <div className={styles.colorGrid}>
                        <ColorSwatch name="Champagne" value="#C9B896" token="--color-champagne" />
                        <ColorSwatch name="Light" value="#E5DFD1" token="--color-champagne-light" light />
                        <ColorSwatch name="Dark" value="#A69A7A" token="--color-champagne-dark" />
                        <ColorSwatch name="Deep" value="#8B7355" token="--color-champagne-deep" />
                    </div>
                </div>

                {/* Status Colors */}
                <div className={styles.colorSection}>
                    <h3 className={styles.colorGroupTitle}>Status Colors</h3>
                    <p className={styles.colorGroupDesc}>Semantic colors for feedback and state.</p>
                    <div className={styles.colorGrid}>
                        <ColorSwatch name="Success" value="#3D6B4F" token="--color-success" />
                        <ColorSwatch name="Success Light" value="#E8F0EB" token="--color-success-light" light />
                        <ColorSwatch name="Warning" value="#8B7355" token="--color-warning" />
                        <ColorSwatch name="Warning Light" value="#F5F0E8" token="--color-warning-light" light />
                        <ColorSwatch name="Error" value="#8B4D4D" token="--color-error" />
                        <ColorSwatch name="Error Light" value="#F5E8E8" token="--color-error-light" light />
                        <ColorSwatch name="Info" value="#4A6B8A" token="--color-info" />
                        <ColorSwatch name="Info Light" value="#E8EEF5" token="--color-info-light" light />
                    </div>
                </div>
            </div>
        </section>
    );
}
