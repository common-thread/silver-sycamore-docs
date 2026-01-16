'use client';

import { useState } from 'react';
import { LogoFull, LogoIcon, LogoText } from '@/components/Logo';
import styles from './page.module.css';

export default function StyleGuidePage() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLogo}>
            <LogoFull size="lg" />
          </div>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Staff Hub Design System</span>
            <h1 className={styles.heroTitle}>Brand Foundation</h1>
            <p className={styles.heroSubtitle}>
              The authoritative reference for Silver Sycamore's visual language.
              Warm, scholarly, and effortlessly readable.
            </p>
          </div>
          <div className={styles.heroDivider} />
        </div>
      </header>

      {/* Logo Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Identity</span>
            <h2 className={styles.sectionTitle}>Logo</h2>
            <p className={styles.sectionDescription}>
              The Silver Sycamore logo system consists of three variants. Follow these guidelines
              to ensure consistent, professional brand presentation across all applications.
            </p>
          </div>

          {/* Logo Variants */}
          <div className={styles.logoShowcase}>
            <div className={styles.logoCard}>
              <div className={styles.logoPreview}>
                <LogoFull size="md" />
              </div>
              <div className={styles.logoInfo}>
                <h3 className={styles.logoName}>Full Logo</h3>
                <p className={styles.logoUsage}>Primary mark. Use when space permits and brand recognition is priority.</p>
                <div className={styles.logoMeta}>
                  <span>Aspect: 1.5:1</span>
                  <span>Min height: 48px</span>
                </div>
              </div>
            </div>

            <div className={styles.logoCard}>
              <div className={styles.logoPreview}>
                <LogoIcon size="md" />
              </div>
              <div className={styles.logoInfo}>
                <h3 className={styles.logoName}>Icon Mark</h3>
                <p className={styles.logoUsage}>Secondary mark. Use for favicons, app icons, social avatars.</p>
                <div className={styles.logoMeta}>
                  <span>Aspect: 2.13:1</span>
                  <span>Min height: 30px</span>
                </div>
              </div>
            </div>

            <div className={styles.logoCard}>
              <div className={styles.logoPreview}>
                <LogoText size="md" />
              </div>
              <div className={styles.logoInfo}>
                <h3 className={styles.logoName}>Wordmark</h3>
                <p className={styles.logoUsage}>Text-only variant. Use in horizontal layouts, footers, compact headers.</p>
                <div className={styles.logoMeta}>
                  <span>Aspect: 5.9:1</span>
                  <span>Min height: 24px</span>
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

      {/* Color Palette */}
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

      {/* Typography */}
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

      {/* Buttons */}
      <section className={styles.section} data-bg="warm">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Interactive</span>
            <h2 className={styles.sectionTitle}>Buttons</h2>
            <p className={styles.sectionDescription}>
              Refined, elegant buttons with subtle hover transitions. Each variant serves
              a specific purpose in the interface hierarchy.
            </p>
          </div>

          <div className={styles.buttonShowcase}>
            {/* Primary */}
            <div className={styles.buttonGroup}>
              <h3 className={styles.buttonGroupTitle}>Primary</h3>
              <p className={styles.buttonGroupDesc}>Principal actions. Form submissions, primary CTAs.</p>
              <div className={styles.buttonRow}>
                <button className={styles.btnPrimary}>Create Document</button>
                <button className={styles.btnPrimary} disabled>Disabled</button>
              </div>
            </div>

            {/* Secondary */}
            <div className={styles.buttonGroup}>
              <h3 className={styles.buttonGroupTitle}>Secondary</h3>
              <p className={styles.buttonGroupDesc}>Supporting actions. Pairs with primary buttons.</p>
              <div className={styles.buttonRow}>
                <button className={styles.btnSecondary}>View Details</button>
                <button className={styles.btnSecondary} disabled>Disabled</button>
              </div>
            </div>

            {/* Ghost */}
            <div className={styles.buttonGroup}>
              <h3 className={styles.buttonGroupTitle}>Ghost</h3>
              <p className={styles.buttonGroupDesc}>Tertiary actions. Cancel, navigation, less emphasis.</p>
              <div className={styles.buttonRow}>
                <button className={styles.btnGhost}>Cancel</button>
                <button className={styles.btnGhost} disabled>Disabled</button>
              </div>
            </div>

            {/* Accent */}
            <div className={styles.buttonGroup}>
              <h3 className={styles.buttonGroupTitle}>Accent</h3>
              <p className={styles.buttonGroupDesc}>Highlighted actions. Special emphasis, celebrations.</p>
              <div className={styles.buttonRow}>
                <button className={styles.btnAccent}>Submit for Review</button>
                <button className={styles.btnAccent} disabled>Disabled</button>
              </div>
            </div>

            {/* Sizes */}
            <div className={styles.buttonGroup}>
              <h3 className={styles.buttonGroupTitle}>Sizes</h3>
              <p className={styles.buttonGroupDesc}>Available in small, default, and large variants.</p>
              <div className={styles.buttonRow}>
                <button className={`${styles.btnPrimary} ${styles.btnSm}`}>Small</button>
                <button className={styles.btnPrimary}>Default</button>
                <button className={`${styles.btnPrimary} ${styles.btnLg}`}>Large</button>
              </div>
            </div>

            {/* With Icons */}
            <div className={styles.buttonGroup}>
              <h3 className={styles.buttonGroupTitle}>With Icons</h3>
              <p className={styles.buttonGroupDesc}>Buttons can include icons for additional context.</p>
              <div className={styles.buttonRow}>
                <button className={styles.btnPrimary}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Add Document
                </button>
                <button className={styles.btnSecondary}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </button>
              </div>
            </div>

            {/* Icon Only */}
            <div className={styles.buttonGroup}>
              <h3 className={styles.buttonGroupTitle}>Icon Only</h3>
              <p className={styles.buttonGroupDesc}>Square buttons for compact icon-only actions.</p>
              <div className={styles.buttonRow}>
                <button className={styles.btnIcon} aria-label="Edit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button className={styles.btnIcon} aria-label="Delete">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
                <button className={styles.btnIcon} aria-label="Settings">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Forms</span>
            <h2 className={styles.sectionTitle}>Form Elements</h2>
            <p className={styles.sectionDescription}>
              Clean, accessible form controls that maintain the elegant aesthetic while
              providing clear feedback states.
            </p>
          </div>

          <div className={styles.formShowcase}>
            <div className={styles.formCard}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Text Input
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Enter document title..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <span className={styles.formHelper}>A clear, descriptive title for easy reference</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  className={styles.formInput}
                  placeholder="email@silversycamore.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Date</label>
                <input
                  type="date"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  className={styles.formSelect}
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <option value="">Choose a category...</option>
                  <option value="procedures">Procedures</option>
                  <option value="policies">Policies</option>
                  <option value="training">Training Materials</option>
                  <option value="forms">Forms & Templates</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Enter a brief description..."
                  rows={4}
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.formCheckbox}
                    checked={checkboxValue}
                    onChange={(e) => setCheckboxValue(e.target.checked)}
                  />
                  <span className={styles.checkboxText}>Notify team members when published</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Disabled State</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value="Read only value"
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Error State
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.formInput} ${styles.formInputError}`}
                  value="Invalid entry"
                  readOnly
                />
                <span className={styles.formError}>This field is required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className={styles.section} data-bg="warm">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Components</span>
            <h2 className={styles.sectionTitle}>Cards</h2>
            <p className={styles.sectionDescription}>
              Versatile card components for displaying content in contained, scannable units.
            </p>
          </div>

          <div className={styles.cardShowcase}>
            <div className={styles.cardGrid}>
              {/* Default Card */}
              <div className={styles.card}>
                <span className={styles.cardEyebrow}>Procedures</span>
                <h3 className={styles.cardTitle}>Opening Checklist</h3>
                <p className={styles.cardDescription}>
                  Complete morning setup procedures for front-of-house staff,
                  including safety checks and preparation tasks.
                </p>
                <div className={styles.cardMeta}>
                  <span>Updated 3 days ago</span>
                  <span>·</span>
                  <span>5 min read</span>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.btnGhost}>View</button>
                  <button className={styles.btnSecondary}>Edit</button>
                </div>
              </div>

              {/* Accent Card */}
              <div className={`${styles.card} ${styles.cardAccent}`}>
                <span className={styles.cardEyebrow}>Featured</span>
                <h3 className={styles.cardTitle}>Emergency Protocols</h3>
                <p className={styles.cardDescription}>
                  Critical safety procedures and emergency response guidelines.
                  Required reading for all staff members.
                </p>
                <div className={styles.cardMeta}>
                  <span>Updated today</span>
                  <span>·</span>
                  <span>10 min read</span>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.btnGhost}>View</button>
                  <button className={styles.btnAccent}>Start Training</button>
                </div>
              </div>

              {/* Subtle Card */}
              <div className={`${styles.card} ${styles.cardSubtle}`}>
                <span className={styles.cardEyebrow}>Archive</span>
                <h3 className={styles.cardTitle}>2025 Event Guide</h3>
                <p className={styles.cardDescription}>
                  Historical reference for past event procedures and lessons learned.
                </p>
                <div className={styles.cardMeta}>
                  <span>Archived</span>
                  <span>·</span>
                  <span>25 min read</span>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.btnGhost}>View Archive</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Status</span>
            <h2 className={styles.sectionTitle}>Badges</h2>
            <p className={styles.sectionDescription}>
              Status indicators for documents and system states. Both outlined and filled
              variants available.
            </p>
          </div>

          <div className={styles.badgeShowcase}>
            <div className={styles.badgeGroup}>
              <h3 className={styles.badgeGroupTitle}>Document Status</h3>
              <div className={styles.badgeRow}>
                <span className={`${styles.badge} ${styles.badgeDraft}`}>Draft</span>
                <span className={`${styles.badge} ${styles.badgePending}`}>Pending Review</span>
                <span className={`${styles.badge} ${styles.badgeApproved}`}>Approved</span>
                <span className={`${styles.badge} ${styles.badgeArchived}`}>Archived</span>
              </div>
            </div>

            <div className={styles.badgeGroup}>
              <h3 className={styles.badgeGroupTitle}>Filled Variants</h3>
              <div className={styles.badgeRow}>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgeDraft}`}>Draft</span>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgePending}`}>Pending</span>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgeApproved}`}>Approved</span>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgeArchived}`}>Archived</span>
              </div>
            </div>

            <div className={styles.badgeGroup}>
              <h3 className={styles.badgeGroupTitle}>Priority Levels</h3>
              <div className={styles.badgeRow}>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgeUrgent}`}>Urgent</span>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgeHigh}`}>High</span>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgeMedium}`}>Medium</span>
                <span className={`${styles.badge} ${styles.badgeFilled} ${styles.badgeLow}`}>Low</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing & Shadows */}
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

      {/* Loading States */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Feedback</span>
            <h2 className={styles.sectionTitle}>Loading States</h2>
            <p className={styles.sectionDescription}>
              Visual feedback for asynchronous operations.
            </p>
          </div>

          <div className={styles.loadingShowcase}>
            <div className={styles.loadingItem}>
              <span className={styles.loadingLabel}>Spinner</span>
              <div className={styles.spinner} />
            </div>

            <div className={styles.loadingItem}>
              <span className={styles.loadingLabel}>Skeleton</span>
              <div className={styles.skeletonDemo}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} style={{ width: '75%' }} />
                <div className={styles.skeletonLine} style={{ width: '50%' }} />
              </div>
            </div>

            <div className={styles.loadingItem}>
              <span className={styles.loadingLabel}>Button Loading</span>
              <button className={styles.btnPrimary} disabled>
                <div className={styles.spinnerSmall} />
                Processing...
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <LogoIcon size="sm" />
          <div className={styles.footerText}>
            <span>Silver Sycamore Staff Hub</span>
            <span className={styles.footerDivider}>·</span>
            <span>Design System v1.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================================
   Helper Components
   ============================================================================ */

function ColorSwatch({ name, value, token, light }: {
  name: string;
  value: string;
  token: string;
  light?: boolean;
}) {
  return (
    <div className={styles.colorSwatch}>
      <div
        className={styles.swatchColor}
        style={{
          background: value,
          border: light ? '1px solid var(--color-border)' : 'none'
        }}
      />
      <div className={styles.swatchInfo}>
        <span className={styles.swatchName}>{name}</span>
        <span className={styles.swatchValue}>{value}</span>
        <code className={styles.swatchToken}>{token}</code>
      </div>
    </div>
  );
}

function TypeSample({ label, size, token, sample, font, uppercase }: {
  label: string;
  size: string;
  token: string;
  sample: string;
  font: 'display' | 'body';
  uppercase?: boolean;
}) {
  return (
    <div className={styles.typeItem}>
      <div className={styles.typeLabel}>
        <span className={styles.typeLabelName}>{label}</span>
        <span className={styles.typeLabelSize}>{size}</span>
      </div>
      <div
        className={styles.typeSample}
        style={{
          fontFamily: font === 'display' ? 'var(--font-display)' : 'var(--font-body)',
          fontSize: `var(${token})`,
          textTransform: uppercase ? 'uppercase' : 'none',
          letterSpacing: uppercase ? 'var(--tracking-wider)' : 'inherit'
        }}
      >
        {sample}
      </div>
      <code className={styles.typeToken}>{token}</code>
    </div>
  );
}

function SpacingSample({ size, token }: { size: string; token: string }) {
  return (
    <div className={styles.spacingItem}>
      <div
        className={styles.spacingBox}
        style={{ width: size, height: size }}
      />
      <div className={styles.spacingInfo}>
        <span className={styles.spacingSize}>{size}</span>
        <code className={styles.spacingToken}>{token}</code>
      </div>
    </div>
  );
}
