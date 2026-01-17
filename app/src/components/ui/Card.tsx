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
          return "var(--space-4)";
        case "lg":
          return "var(--space-8)";
        default: // md
          return "var(--space-6)";
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "elevated":
          return {
            backgroundColor: "var(--color-surface)",
            border: "none",
            boxShadow: "var(--shadow-md)",
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
        transition: `all var(--duration-fast) var(--ease-out)`,
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
              target.style.boxShadow = "var(--shadow-lg)";
              target.style.transform = "translateY(-1px)";
            } else if (variant === "outlined") {
              target.style.borderColor = "var(--color-border-strong)";
              target.style.backgroundColor = "var(--color-surface)";
            } else {
              target.style.borderColor = "var(--color-border-strong)";
              target.style.boxShadow = "var(--shadow-xs)";
            }
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (interactive) {
            const target = e.currentTarget;
            if (variant === "elevated") {
              target.style.boxShadow = "var(--shadow-md)";
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
        marginBottom: "var(--space-4)",
        paddingBottom: "var(--space-4)",
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
        fontSize: Component === "h2" ? "var(--text-2xl)" : Component === "h3" ? "var(--text-xl)" : "var(--text-lg)",
        fontWeight: "var(--font-semibold)",
        color: "var(--color-ink)",
        letterSpacing: "var(--tracking-snug)",
        lineHeight: "var(--leading-snug)",
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
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-normal)",
        color: "var(--color-ink-muted)",
        lineHeight: "var(--leading-relaxed)",
        margin: 0,
        marginTop: "var(--space-1-5)",
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
        fontSize: "var(--text-sm)",
        color: "var(--color-ink)",
        lineHeight: "var(--leading-relaxed)",
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
        marginTop: "var(--space-4)",
        paddingTop: "var(--space-4)",
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
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
