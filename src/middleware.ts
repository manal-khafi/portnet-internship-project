import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  let user: any = null;

  // 1. Verify access token ONLY
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      user = payload;
    } catch {
      user = null;
    }
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isAgentRoute = pathname.startsWith("/agent");
  const isProtected = isAdminRoute || isAgentRoute;

  // 2. Block if not logged in
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Role checks
  if (isAdminRoute && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/agent/dashboard", request.url));
  }

  if (isAgentRoute && user?.role !== "AGENT" && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Prevent login page if already logged in
  if (pathname === "/login" && user) {
    const target =
      user.role === "ADMIN"
        ? "/admin/dashboard"
        : "/agent/dashboard";

    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/login"],
};