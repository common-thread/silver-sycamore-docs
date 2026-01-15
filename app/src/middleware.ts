import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Development bypass - set NEXT_PUBLIC_BYPASS_AUTH=true in .env.local to skip auth
const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/signin(.*)", "/api(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // Skip auth checks in development when bypass is enabled
  if (bypassAuth) {
    return;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
