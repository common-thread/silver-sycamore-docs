import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/signin"]);

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/",
  "/services(.*)",
  "/clients(.*)",
  "/staff(.*)",
  "/operations(.*)",
  "/deliverables(.*)",
  "/catalog(.*)",
  "/components(.*)",
]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const authenticated = await convexAuth.isAuthenticated();

    // Redirect signed-in users away from signin page
    if (isPublicRoute(request) && authenticated) {
      return nextjsMiddlewareRedirect(request, "/");
    }

    // Redirect unauthenticated users to signin
    if (isProtectedRoute(request) && !authenticated) {
      return nextjsMiddlewareRedirect(request, "/signin");
    }
  },
  {
    // 30-day session for convenience
    cookieConfig: { maxAge: 60 * 60 * 24 * 30 },
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
