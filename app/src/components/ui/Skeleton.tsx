"use client";

import { forwardRef, HTMLAttributes } from "react";

type SkeletonVariant = "text" | "title" | "card" | "avatar" | "button" | "input";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Type of skeleton to render */
  variant?: SkeletonVariant;
  /** Width - can be CSS value or number (px) */
  width?: string | number;
  /** Height - can be CSS value or number (px) */
  height?: string | number;
  /** Number of skeleton items to render (for lists) */
  count?: number;
  /** Disable animation */
  static?: boolean;
}

/**
 * Skeleton loading placeholder component.
 * Uses the shimmer animation from the design system.
 *
 * @example
 * ```tsx
 * // Single text line
 * <Skeleton variant="text" />
 *
 * // Title placeholder
 * <Skeleton variant="title" width="60%" />
 *
 * // Card placeholder
 * <Skeleton variant="card" height={200} />
 *
 * // Multiple skeleton items
 * <Skeleton variant="text" count={3} />
 * ```
 */
const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      count = 1,
      static: isStatic = false,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case "title":
          return {
            height: height ?? "1.5em",
            width: width ?? "60%",
            borderRadius: "var(--radius-sm)",
          };
        case "card":
          return {
            height: height ?? "120px",
            width: width ?? "100%",
            borderRadius: "var(--radius-lg)",
          };
        case "avatar":
          return {
            height: height ?? "40px",
            width: width ?? "40px",
            borderRadius: "50%",
          };
        case "button":
          return {
            height: height ?? "40px",
            width: width ?? "100px",
            borderRadius: "var(--radius-md)",
          };
        case "input":
          return {
            height: height ?? "40px",
            width: width ?? "100%",
            borderRadius: "var(--radius-md)",
          };
        case "text":
        default:
          return {
            height: height ?? "1em",
            width: width ?? "100%",
            borderRadius: "2px",
          };
      }
    };

    const baseStyles: React.CSSProperties = {
      background: isStatic
        ? "var(--color-paper-mid)"
        : "linear-gradient(90deg, var(--color-paper-mid) 25%, var(--color-paper-warm) 50%, var(--color-paper-mid) 75%)",
      backgroundSize: "200% 100%",
      animation: isStatic ? "none" : "shimmer 1.5s infinite ease-in-out",
      ...getVariantStyles(),
      ...style,
    };

    // Render multiple skeletons if count > 1
    if (count > 1) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              ref={index === 0 ? ref : undefined}
              className={`skeleton ${className}`}
              style={{
                ...baseStyles,
                // Vary width slightly for text lists to look more natural
                width:
                  variant === "text" && !width
                    ? `${100 - Math.random() * 20}%`
                    : baseStyles.width,
              }}
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`skeleton ${className}`}
        style={baseStyles}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

/**
 * Pre-built skeleton compositions for common UI patterns.
 */

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        padding: "var(--space-5)",
        backgroundColor: "var(--color-paper-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <Skeleton variant="title" style={{ marginBottom: "var(--space-3)" }} />
      <Skeleton variant="text" count={2} />
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-3)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <Skeleton variant="avatar" width={32} height={32} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" style={{ marginBottom: "var(--space-1)" }} />
            <Skeleton variant="text" width="70%" height="0.75em" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonToolbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-2)",
        backgroundColor: "var(--color-paper-warm)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="button" width={32} height={32} />
      ))}
    </div>
  );
}

export function SkeletonEditor() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SkeletonToolbar />
      <div
        style={{
          minHeight: "300px",
          padding: "var(--space-4)",
          backgroundColor: "var(--color-paper-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Skeleton variant="title" style={{ marginBottom: "var(--space-4)" }} />
        <Skeleton variant="text" count={5} />
      </div>
    </div>
  );
}

export default Skeleton;
