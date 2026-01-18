"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Auth toggle: defaults to enabled if not set or if explicitly "true"
// Only bypasses auth when explicitly set to "false"
const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH !== "false";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // When auth is disabled, render Convex provider directly without Clerk
  if (!isAuthEnabled) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  // When auth is enabled, use full Clerk + Convex integration
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
