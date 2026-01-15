"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      interactive = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const getPaddingValue = () => {
      switch (padding) {
        case "none":
          return "0";
        case "sm":
          return "1rem";
        case "lg":
          return "2rem";
        default: // md
          return "1.5rem";
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "elevated":
          return {
            backgroundColor: "var(--color-surface)",
            border: "none",
            boxShadow: "0 2px 8px rgba(20, 20, 20, 0.06), 0 1px 2px rgba(20, 20, 20, 0.04)",
          };
        case "outlined":
          return {
            backgroundColor: "transparent",
            border: "1px solid var(--color-border)",
            boxShadow: "none",
          };
        default: // default
          return {
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "none",
          };
      }
    };

    const getInteractiveStyles = () => {
      if (!interactive) return {};
      return {
        cursor: "pointer",
        transition: "all 180ms ease-out",
      };
    };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          borderRadius: 0,
          padding: getPaddingValue(),
          ...getVariantStyles(),
          ...getInteractiveStyles(),
        }}
        onMouseEnter={(e) => {
          if (interactive) {
            const target = e.currentTarget;
            if (variant === "elevated") {
              target.style.boxShadow = "0 4px 16px rgba(20, 20, 20, 0.08), 0 2px 4px rgba(20, 20, 20, 0.04)";
              target.style.transform = "translateY(-1px)";
            } else if (variant === "outlined") {
              target.style.borderColor = "var(--color-border-strong)";
              target.style.backgroundColor = "var(--color-surface)";
            } else {
              target.style.borderColor = "var(--color-border-strong)";
              target.style.boxShadow = "0 1px 3px rgba(20, 20, 20, 0.04)";
            }
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (interactive) {
            const target = e.currentTarget;
            if (variant === "elevated") {
              target.style.boxShadow = "0 2px 8px rgba(20, 20, 20, 0.06), 0 1px 2px rgba(20, 20, 20, 0.04)";
              target.style.transform = "translateY(0)";
            } else if (variant === "outlined") {
              target.style.borderColor = "var(--color-border)";
              target.style.backgroundColor = "transparent";
            } else {
              target.style.borderColor = "var(--color-border)";
              target.style.boxShadow = "none";
            }
          }
          props.onMouseLeave?.(e);
        }}
        onFocus={(e) => {
          if (interactive) {
            const target = e.currentTarget;
            target.style.outline = "2px solid var(--color-accent)";
            target.style.outlineOffset = "2px";
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (interactive) {
            const target = e.currentTarget;
            target.style.outline = "none";
          }
          props.onBlur?.(e);
        }}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card sub-components for structured content
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        marginBottom: "1rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--color-border)",
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h2" | "h3" | "h4";
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", children, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={className}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: Component === "h2" ? "1.5rem" : Component === "h3" ? "1.25rem" : "1.125rem",
        fontWeight: 600,
        color: "var(--color-ink)",
        letterSpacing: "-0.02em",
        lineHeight: 1.3,
        margin: 0,
      }}
      {...props}
    >
      {children}
    </Component>
  )
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = "", children, ...props }, ref) => (
    <p
      ref={ref}
      className={className}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        fontWeight: 400,
        color: "var(--color-ink-muted)",
        lineHeight: 1.6,
        margin: 0,
        marginTop: "0.375rem",
      }}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.9375rem",
        color: "var(--color-ink)",
        lineHeight: 1.6,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        marginTop: "1rem",
        paddingTop: "1rem",
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export default Card;
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
