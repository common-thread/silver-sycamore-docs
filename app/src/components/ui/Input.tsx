"use client";

import { forwardRef, InputHTMLAttributes } from "react";

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
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    // Build input field classes
    const sizeClass = `input-${inputSize}`;
    const variantClass = variant === "filled" ? "input-filled" : "";
    const errorClass = hasError ? "input-field-error" : "";
    const inputClasses = ["input-field", sizeClass, variantClass, errorClass]
      .filter(Boolean)
      .join(" ");

    // Build label classes
    const labelClasses = ["input-label", disabled ? "input-label-disabled" : ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`input-wrapper ${className}`}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={inputClasses}
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
          <span id={`${inputId}-error`} role="alert" className="input-error-text">
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${inputId}-hint`} className="input-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
