"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "accent";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const getVariantColors = () => {
      switch (variant) {
        case "success":
          return {
            backgroundColor: "var(--color-success-light)",
            color: "var(--color-success-dark)",
            dotColor: "var(--color-success)",
          };
        case "warning":
          return {
            backgroundColor: "rgba(180, 130, 50, 0.12)",
            color: "#8B6914",
            dotColor: "#B48232",
          };
        case "error":
          return {
            backgroundColor: "var(--color-error-bg)",
            color: "var(--color-error-dark)",
            dotColor: "var(--color-error)",
          };
        case "info":
          return {
            backgroundColor: "rgba(80, 120, 180, 0.12)",
            color: "#3D5A80",
            dotColor: "#5078B4",
          };
        case "accent":
          return {
            backgroundColor: "rgba(139, 115, 85, 0.12)",
            color: "var(--color-accent-hover)",
            dotColor: "var(--color-accent)",
          };
        default: // default - neutral
          return {
            backgroundColor: "var(--color-surface-dim)",
            color: "var(--color-ink-light)",
            dotColor: "var(--color-ink-muted)",
          };
      }
    };

    const getSizeStyles = () => {
      if (size === "sm") {
        return {
          fontSize: "var(--text-2xs)",
          padding: dot ? "var(--space-1) var(--space-2) var(--space-1) var(--space-1-5)" : "var(--space-1) var(--space-2)",
          gap: "var(--space-1)",
        };
      }
      // md
      return {
        fontSize: "var(--text-xs)",
        padding: dot ? "var(--space-1-5) var(--space-2-5) var(--space-1-5) var(--space-2)" : "var(--space-1-5) var(--space-2-5)",
        gap: "var(--space-1-5)",
      };
    };

    const colors = getVariantColors();
    const sizeStyles = getSizeStyles();

    return (
      <span
        ref={ref}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "var(--font-body)",
          fontWeight: "var(--font-medium)",
          letterSpacing: "var(--tracking-normal)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          borderRadius: 0,
          backgroundColor: colors.backgroundColor,
          color: colors.color,
          fontSize: sizeStyles.fontSize,
          padding: sizeStyles.padding,
          gap: sizeStyles.gap,
        }}
        {...props}
      >
        {dot && (
          <span
            style={{
              width: size === "sm" ? "var(--space-1-5)" : "var(--space-2)",
              height: size === "sm" ? "var(--space-1-5)" : "var(--space-2)",
              borderRadius: "50%",
              backgroundColor: colors.dotColor,
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
