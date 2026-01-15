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
            backgroundColor: "rgba(76, 130, 76, 0.12)",
            color: "#3D6B3D",
            dotColor: "#4C824C",
          };
        case "warning":
          return {
            backgroundColor: "rgba(180, 130, 50, 0.12)",
            color: "#8B6914",
            dotColor: "#B48232",
          };
        case "error":
          return {
            backgroundColor: "rgba(199, 80, 80, 0.12)",
            color: "#A33A3A",
            dotColor: "#C75050",
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
          fontSize: "0.6875rem",
          padding: dot ? "0.25rem 0.5rem 0.25rem 0.375rem" : "0.25rem 0.5rem",
          gap: "0.25rem",
        };
      }
      // md
      return {
        fontSize: "0.75rem",
        padding: dot ? "0.375rem 0.625rem 0.375rem 0.5rem" : "0.375rem 0.625rem",
        gap: "0.375rem",
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
          fontWeight: 500,
          letterSpacing: "0.02em",
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
              width: size === "sm" ? "0.375rem" : "0.5rem",
              height: size === "sm" ? "0.375rem" : "0.5rem",
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
