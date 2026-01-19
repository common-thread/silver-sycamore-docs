import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Passthrough middleware - no authentication
export default function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
