import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

// Size configurations for each variant
const sizeConfig = {
  full: {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 },
  },
  icon: {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  },
  text: {
    sm: { width: 100, height: 24 },
    md: { width: 150, height: 36 },
    lg: { width: 200, height: 48 },
  },
};

/**
 * Full logo (icon + text)
 * Use for: Headers, prominent branding areas
 */
export function LogoFull({ size = "md", className }: LogoProps) {
  const { width, height } = sizeConfig.full[size];

  return (
    <Image
      src="/logo-full.png"
      alt="Silver Sycamore"
      width={width}
      height={height}
      className={className}
      priority
      style={{ objectFit: "contain" }}
    />
  );
}

/**
 * Icon only (tree mark)
 * Use for: Favicons, compact spaces, loading states
 */
export function LogoIcon({ size = "md", className }: LogoProps) {
  const { width, height } = sizeConfig.icon[size];

  return (
    <Image
      src="/logo-icon.png"
      alt="Silver Sycamore"
      width={width}
      height={height}
      className={className}
      priority
      style={{ objectFit: "contain" }}
    />
  );
}

/**
 * Text only (wordmark)
 * Use for: When icon is shown separately, footer, etc.
 */
export function LogoText({ size = "md", className }: LogoProps) {
  const { width, height } = sizeConfig.text[size];

  return (
    <Image
      src="/logo-text.png"
      alt="Silver Sycamore"
      width={width}
      height={height}
      className={className}
      priority
      style={{ objectFit: "contain" }}
    />
  );
}

// Default export for convenience
export { LogoFull as Logo };
