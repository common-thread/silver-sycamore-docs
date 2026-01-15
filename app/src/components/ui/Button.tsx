"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      disabled = false,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={className}
        style={{
          // Base styles
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          letterSpacing: "0.02em",
          border: "none",
          borderRadius: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5em",
          transition: "all 180ms ease-out",
          position: "relative",
          textDecoration: "none",
          whiteSpace: "nowrap",
          userSelect: "none",

          // Size-specific styles
          ...(size === "sm" && {
            padding: "0.5rem 1rem",
            fontSize: "0.8125rem",
            minHeight: "2rem",
          }),
          ...(size === "md" && {
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            minHeight: "2.5rem",
          }),
          ...(size === "lg" && {
            padding: "1rem 2rem",
            fontSize: "1rem",
            minHeight: "3rem",
          }),

          // Variant-specific styles
          ...(variant === "primary" && {
            backgroundColor: disabled ? "var(--color-ink-muted)" : "var(--color-accent)",
            color: "var(--color-surface)",
            boxShadow: disabled ? "none" : "inset 0 -2px 0 var(--color-accent-hover)",
          }),
          ...(variant === "secondary" && {
            backgroundColor: "transparent",
            color: disabled ? "var(--color-ink-muted)" : "var(--color-ink)",
            border: `1px solid ${disabled ? "var(--color-border)" : "var(--color-ink-light)"}`,
          }),
          ...(variant === "ghost" && {
            backgroundColor: "transparent",
            color: disabled ? "var(--color-ink-muted)" : "var(--color-ink)",
            padding: size === "sm" ? "0.5rem 0.75rem" : size === "md" ? "0.75rem 1rem" : "1rem 1.25rem",
          }),

          // Disabled opacity
          ...(disabled && {
            opacity: 0.6,
          }),
        }}
        onMouseEnter={(e) => {
          if (disabled) return;
          const target = e.currentTarget;
          if (variant === "primary") {
            target.style.backgroundColor = "var(--color-accent-hover)";
            target.style.boxShadow = "inset 0 -2px 0 rgba(0,0,0,0.2)";
          } else if (variant === "secondary") {
            target.style.backgroundColor = "var(--color-surface-dim, #F4F4F2)";
            target.style.borderColor = "var(--color-ink)";
          } else if (variant === "ghost") {
            target.style.backgroundColor = "var(--color-surface-dim, #F4F4F2)";
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (disabled) return;
          const target = e.currentTarget;
          if (variant === "primary") {
            target.style.backgroundColor = "var(--color-accent)";
            target.style.boxShadow = "inset 0 -2px 0 var(--color-accent-hover)";
          } else if (variant === "secondary") {
            target.style.backgroundColor = "transparent";
            target.style.borderColor = "var(--color-ink-light)";
          } else if (variant === "ghost") {
            target.style.backgroundColor = "transparent";
          }
          props.onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          if (disabled) return;
          const target = e.currentTarget;
          target.style.transform = "translateY(1px)";
          if (variant === "primary") {
            target.style.boxShadow = "none";
          }
          props.onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          if (disabled) return;
          const target = e.currentTarget;
          target.style.transform = "translateY(0)";
          if (variant === "primary") {
            target.style.boxShadow = "inset 0 -2px 0 var(--color-accent-hover)";
          }
          props.onMouseUp?.(e);
        }}
        onFocus={(e) => {
          const target = e.currentTarget;
          target.style.outline = "2px solid var(--color-accent)";
          target.style.outlineOffset = "2px";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          const target = e.currentTarget;
          target.style.outline = "none";
          props.onBlur?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
