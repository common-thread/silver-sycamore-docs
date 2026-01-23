import { TypeSample } from './BrandHelpers';
import styles from './brand.module.css';

export default function TypeScale() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.eyebrow}>Typography</span>
                    <h2 className={styles.sectionTitle}>Type Scale</h2>
                    <p className={styles.sectionDescription}>
                        An editorial approach to typography. Playfair Display for elegant headings,
                        DM Sans for clean, readable body text. Generous sizing for comfortable reading.
                    </p>
                </div>

                <div className={styles.typeShowcase}>
                    {/* Display Font */}
                    <div className={styles.fontFamily}>
                        <h3 className={styles.fontFamilyName}>Playfair Display</h3>
                        <p className={styles.fontFamilyRole}>Display & Headings</p>
                        <div className={styles.fontSample} style={{ fontFamily: 'var(--font-display)' }}>
                            The quick brown fox jumps over the lazy dog
                        </div>
                    </div>

                    {/* Body Font */}
                    <div className={styles.fontFamily}>
                        <h3 className={styles.fontFamilyName}>DM Sans</h3>
                        <p className={styles.fontFamilyRole}>Body & UI</p>
                        <div className={styles.fontSample} style={{ fontFamily: 'var(--font-body)' }}>
                            The quick brown fox jumps over the lazy dog
                        </div>
                    </div>

                    <div className={styles.typeDivider} />

                    {/* Heading Scale */}
                    <div className={styles.typeScale}>
                        <TypeSample
                            label="Display"
                            size="52px"
                            token="--text-5xl"
                            sample="Silver Sycamore"
                            font="display"
                        />
                        <TypeSample
                            label="H1"
                            size="40px"
                            token="--text-4xl"
                            sample="Staff Hub"
                            font="display"
                        />
                        <TypeSample
                            label="H2"
                            size="32px"
                            token="--text-3xl"
                            sample="Procedures & Guidelines"
                            font="display"
                        />
                        <TypeSample
                            label="H3"
                            size="26px"
                            token="--text-2xl"
                            sample="Getting Started"
                            font="display"
                        />
                        <TypeSample
                            label="H4"
                            size="22px"
                            token="--text-xl"
                            sample="Quick Reference"
                            font="display"
                        />
                        <TypeSample
                            label="H5"
                            size="19px"
                            token="--text-lg"
                            sample="Section Overview"
                            font="display"
                        />
                    </div>

                    <div className={styles.typeDivider} />

                    {/* Body Scale */}
                    <div className={styles.typeScale}>
                        <TypeSample
                            label="Lead"
                            size="19px"
                            token="--text-lg"
                            sample="Curated experiences for your team, from daily operations to special events."
                            font="body"
                        />
                        <TypeSample
                            label="Body"
                            size="17px"
                            token="--text-base"
                            sample="Our platform provides a centralized hub for all operational documentation, team communication, and knowledge sharing."
                            font="body"
                        />
                        <TypeSample
                            label="Secondary"
                            size="15px"
                            token="--text-sm"
                            sample="Last updated by Sarah on January 15, 2026 at 3:45 PM"
                            font="body"
                        />
                        <TypeSample
                            label="Caption"
                            size="13px"
                            token="--text-xs"
                            sample="VERSION 2.1 · APPROVED BY MANAGEMENT"
                            font="body"
                            uppercase
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
