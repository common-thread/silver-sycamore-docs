"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg" | "icon";

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
    // Build class list using CSS design system classes
    const variantClass = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      accent: "btn-accent",
    }[variant];

    const sizeClass = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
      icon: "btn-icon",
    }[size];

    const classes = ["btn", variantClass, sizeClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
