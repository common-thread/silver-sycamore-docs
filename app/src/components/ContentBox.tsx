interface ContentBoxProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "subtle";
  className?: string;
}

export function ContentBox({
  children,
  variant = "default",
  className = "",
}: ContentBoxProps) {
  const variantClass =
    variant === "accent"
      ? "card-accent"
      : variant === "subtle"
        ? "card-subtle"
        : "";

  return (
    <div className={`content-section ${variantClass} ${className}`}>
      {children}
    </div>
  );
}
