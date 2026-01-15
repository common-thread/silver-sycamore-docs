import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div
      style={{
        marginBottom: "2rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Breadcrumbs - document path style */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          style={{
            marginBottom: "0.75rem",
          }}
        >
          <ol
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
            }}
          >
            {breadcrumbs.map((crumb, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      color: "var(--color-border-strong)",
                    }}
                  >
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    style={{
                      color: "var(--color-ink-muted)",
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-ink-muted)";
                    }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: "var(--color-ink-light)" }}>
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title row with actions */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.25rem",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "var(--color-ink)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              style={{
                marginTop: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "var(--color-ink-light)",
                margin: "0.5rem 0 0 0",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexShrink: 0,
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
