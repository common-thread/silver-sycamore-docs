import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

/*
 * Logo sizing based on actual image aspect ratios:
 * - logo-full.png: 1536 x 1024 (1.5:1 ratio)
 * - logo-icon.png: 1436 x 673 (2.13:1 ratio - tree+carriage silhouette)
 * - logo-text.png: 1511 x 256 (5.9:1 ratio - wordmark)
 * - logo-horizontal.png: 5:1 ratio (5000x1000 - icon + wordmark horizontal lockup)
 *
 * Industry standard minimum sizes:
 * - Print: 1 inch / 25mm minimum height
 * - Digital: 24px minimum height for legibility
 * - Header usage: 32-48px height typical
 * - Hero/splash: 80-120px height
 */
const sizes = {
  full: {
    // 1.5:1 aspect ratio (width:height)
    sm: { width: 72, height: 48 },   // Header usage
    md: { width: 120, height: 80 },  // Standard display
    lg: { width: 225, height: 150 }, // Hero/splash - fills showcase boxes
  },
  icon: {
    // 2.13:1 aspect ratio - NOT square (tree+carriage silhouette)
    sm: { width: 64, height: 30 },   // Compact header
    md: { width: 96, height: 45 },   // Standard
    lg: { width: 256, height: 120 }, // Large display - fills showcase boxes
  },
  text: {
    // 5.9:1 aspect ratio (wordmark)
    sm: { width: 142, height: 24 },  // Minimum legible
    md: { width: 177, height: 30 },  // Standard header
    lg: { width: 295, height: 50 },  // Large display - fills showcase boxes
  },
  horizontal: {
    // 5:1 aspect ratio (5000x1000 original)
    sm: { width: 200, height: 40 },  // Compact headers
    md: { width: 300, height: 60 },  // Standard display
    lg: { width: 500, height: 100 }, // Showcase/hero usage
  },
};

export function LogoFull({ size = "md", className }: LogoProps) {
  const { width, height } = sizes.full[size];
  return (
    <Image
      src="/logo-full.png"
      alt="Silver Sycamore"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

export function LogoIcon({ size = "md", className }: LogoProps) {
  const { width, height } = sizes.icon[size];
  return (
    <Image
      src="/logo-icon.png"
      alt="Silver Sycamore"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

export function LogoText({ size = "md", className }: LogoProps) {
  const { width, height } = sizes.text[size];
  return (
    <Image
      src="/logo-text.png"
      alt="Silver Sycamore"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

export function LogoHorizontal({ size = "md", className }: LogoProps) {
  const { width, height } = sizes.horizontal[size];
  return (
    <Image
      src="/logo-horizontal.png"
      alt="Silver Sycamore"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

export { LogoFull as Logo };
