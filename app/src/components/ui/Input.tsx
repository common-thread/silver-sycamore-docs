"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "filled";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  inputSize?: InputSize;
  variant?: InputVariant;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      inputSize = "md",
      variant = "default",
      disabled = false,
      className = "",
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const getSizeStyles = () => {
      switch (inputSize) {
        case "sm":
          return {
            padding: "0.5rem 0.75rem",
            fontSize: "0.8125rem",
            minHeight: "2rem",
          };
        case "lg":
          return {
            padding: "1rem 1.25rem",
            fontSize: "1rem",
            minHeight: "3rem",
          };
        default: // md
          return {
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            minHeight: "2.5rem",
          };
      }
    };

    const getVariantStyles = () => {
      if (variant === "filled") {
        return {
          backgroundColor: disabled
            ? "var(--color-surface-dim)"
            : "var(--color-surface-dim)",
          borderColor: hasError
            ? "var(--color-error)"
            : isFocused
            ? "var(--color-accent)"
            : "transparent",
        };
      }
      // default variant
      return {
        backgroundColor: disabled
          ? "var(--color-surface-dim)"
          : "var(--color-surface)",
        borderColor: hasError
          ? "var(--color-error)"
          : isFocused
          ? "var(--color-accent)"
          : "var(--color-border)",
      };
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.375rem",
          width: "100%",
        }}
        className={className}
      >
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-medium)",
              color: disabled ? "var(--color-ink-muted)" : "var(--color-ink-light)",
              letterSpacing: "0.01em",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            letterSpacing: "0.01em",
            color: disabled ? "var(--color-ink-muted)" : "var(--color-ink)",
            border: "1px solid",
            borderRadius: 0,
            outline: "none",
            width: "100%",
            transition: `all var(--duration-fast) var(--ease-out)`,
            cursor: disabled ? "not-allowed" : "text",
            opacity: disabled ? 0.7 : 1,
            ...getSizeStyles(),
            ...getVariantStyles(),
          }}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
              ? `${inputId}-hint`
              : undefined
          }
          {...props}
        />
        {error && (
          <span
            id={`${inputId}-error`}
            role="alert"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-error)",
              letterSpacing: "0.01em",
            }}
          >
            {error}
          </span>
        )}
        {hint && !error && (
          <span
            id={`${inputId}-hint`}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 400,
              color: "var(--color-ink-muted)",
              letterSpacing: "0.01em",
            }}
          >
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
