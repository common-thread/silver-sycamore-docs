"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "@/components/brand/brand.module.css";
import { useState } from "react";

// Icon definitions with usage context
const ICON_LIBRARY = [
  {
    name: "Home",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    usage: "Navigation, dashboard links",
    category: "navigation",
  },
  {
    name: "Document",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    usage: "Wiki pages, documents, forms",
    category: "content",
  },
  {
    name: "Folder",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    usage: "Folders, categories, organization",
    category: "content",
  },
  {
    name: "Search",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
    usage: "Search inputs, filter triggers",
    category: "action",
  },
  {
    name: "Plus",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    usage: "Add items, create new",
    category: "action",
  },
  {
    name: "Edit",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    usage: "Edit actions, inline editing",
    category: "action",
  },
  {
    name: "Trash",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    usage: "Delete, remove items",
    category: "action",
  },
  {
    name: "Settings",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    usage: "Settings, configuration",
    category: "navigation",
  },
  {
    name: "User",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    usage: "User profile, account",
    category: "navigation",
  },
  {
    name: "Calendar",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    usage: "Events, dates, scheduling",
    category: "content",
  },
  {
    name: "Check",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    usage: "Success, completed, checked",
    category: "status",
  },
  {
    name: "X",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    usage: "Close, dismiss, error",
    category: "action",
  },
  {
    name: "ChevronRight",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    usage: "Navigation, expand, next",
    category: "navigation",
  },
  {
    name: "ChevronDown",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    usage: "Dropdown, expand, collapse",
    category: "navigation",
  },
  {
    name: "Download",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    usage: "Download files, export",
    category: "action",
  },
  {
    name: "Upload",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    usage: "Upload files, import",
    category: "action",
  },
  {
    name: "Share",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    usage: "Share, send to others",
    category: "action",
  },
  {
    name: "AlertCircle",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    usage: "Warning, attention needed",
    category: "status",
  },
  {
    name: "Info",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    usage: "Information, help text",
    category: "status",
  },
  {
    name: "Send",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    usage: "Send message, submit",
    category: "action",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Icons" },
  { id: "navigation", label: "Navigation" },
  { id: "content", label: "Content" },
  { id: "action", label: "Actions" },
  { id: "status", label: "Status" },
];

const SIZES = [
  { size: 16, label: "16px", usage: "Inline, compact UI" },
  { size: 20, label: "20px", usage: "Buttons, inputs" },
  { size: 24, label: "24px", usage: "Standard (default)" },
  { size: 32, label: "32px", usage: "Emphasis, headers" },
];

export default function IconsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const filteredIcons = selectedCategory === "all"
    ? ICON_LIBRARY
    : ICON_LIBRARY.filter((icon) => icon.category === selectedCategory);

  const copyToClipboard = (svg: string, name: string) => {
    navigator.clipboard.writeText(svg);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <Breadcrumb />
            </div>
            <h1 className={styles.heroTitle}>Icon Library</h1>
            <p className={styles.heroSubtitle}>
              Consistent iconography using Lucide icons with Silver Sycamore styling conventions.
            </p>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* Usage Guidelines */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Guidelines</span>
            <h2 className={styles.sectionTitle}>Icon Usage</h2>
            <p className={styles.sectionDescription}>
              Icons should enhance understanding, not replace text. Always pair icons with labels in navigation
              and use consistent sizing within context groups.
            </p>
          </div>

          <div className={styles.guidelinesGrid}>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Stroke Width</div>
              <p className={styles.guidelineText}>
                Use stroke-width of 2 (default). Thinner strokes (1.5) only for dense information displays.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Color</div>
              <p className={styles.guidelineText}>
                Icons inherit text color via currentColor. Use --color-ink for primary, --color-ink-muted for secondary.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Accessibility</div>
              <p className={styles.guidelineText}>
                Add aria-hidden="true" on decorative icons. Use aria-label on icon-only buttons.
              </p>
            </div>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Spacing</div>
              <p className={styles.guidelineText}>
                Maintain 8px (--space-2) minimum between icon and adjacent text or elements.
              </p>
            </div>
          </div>
        </section>

        {/* Size Reference */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Scale</span>
            <h2 className={styles.sectionTitle}>Icon Sizes</h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)", alignItems: "flex-end" }}>
            {SIZES.map(({ size, label, usage }) => (
              <div key={size} style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    background: "var(--color-paper-white)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "var(--space-3)",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: ICON_LIBRARY[0].svg.replace(/width="24"/g, `width="${size}"`).replace(/height="24"/g, `height="${size}"`),
                  }}
                />
                <div style={{ fontWeight: "var(--font-semibold)", fontSize: "var(--text-sm)" }}>{label}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-muted)" }}>{usage}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Icon Grid */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Library</span>
            <h2 className={styles.sectionTitle}>Available Icons</h2>
            <p className={styles.sectionDescription}>
              Click any icon to copy its SVG code. All icons use Lucide design language.
            </p>
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--color-border)",
                  background: selectedCategory === cat.id ? "var(--color-ink)" : "transparent",
                  color: selectedCategory === cat.id ? "var(--color-paper-white)" : "var(--color-ink)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  cursor: "pointer",
                  transition: "all var(--duration-fast)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Icons Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filteredIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => copyToClipboard(icon.svg, icon.name)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "var(--space-5)",
                  background: "var(--color-paper-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "all var(--duration-fast)",
                }}
                title={`Click to copy ${icon.name} SVG`}
                aria-label={`Copy ${icon.name} icon SVG`}
              >
                <div
                  style={{ marginBottom: "var(--space-3)", color: "var(--color-ink)" }}
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                />
                <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)", color: "var(--color-ink)" }}>
                  {copiedIcon === icon.name ? "Copied!" : icon.name}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-muted)", textAlign: "center", marginTop: "var(--space-1)" }}>
                  {icon.usage}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Implementation</span>
            <h2 className={styles.sectionTitle}>Usage Examples</h2>
          </div>

          <div style={{ display: "grid", gap: "var(--space-6)" }}>
            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Inline with Text</div>
              <pre style={{
                background: "var(--color-paper-warm)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-mono)",
                overflow: "auto",
                marginTop: "var(--space-3)",
              }}>
{`<button className="flex items-center gap-2">
  <PlusIcon aria-hidden="true" />
  Add Item
</button>`}
              </pre>
            </div>

            <div className={styles.guidelineCard}>
              <div className={styles.guidelineTitle}>Icon-Only Button</div>
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
          </div>
        </section>
      </div>
    </div>
  );
}
