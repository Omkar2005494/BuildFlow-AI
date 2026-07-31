import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Rate Limiting for the AI API Route
  if (pathname.startsWith("/api/generate")) {
    if (generateRateLimit) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, pending, limit, reset, remaining } = await generateRateLimit.limit(ip);
      
      if (!success) {
        logger.warn({ ip, limit, reset }, "Rate limit exceeded for /api/generate");
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  return NextResponse.next();
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
