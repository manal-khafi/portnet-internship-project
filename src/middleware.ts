import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  let user = null;

  // 1. Validate Access Token
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, secret);
      user = payload;
    } catch (e) {
      user = null;
    }
  }

  const protectedRoutes = ["/dashboard", "/admin", "/agent", "/vessel"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 2. Logic for protected routes
  if (isProtected) {
    // If we have a valid access token, check roles
    if (user) {
      if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (pathname.startsWith("/agent") && user.role !== "AGENT" && user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // If access token is missing or expired, check refresh token
    if (refreshToken) {
      try {
        // Validate refresh token to see if session is still alive
        await jwtVerify(refreshToken, secret);
        // Valid refresh token exists -> Allow access so frontend can call /api/auth/refresh
        return NextResponse.next();
      } catch (e) {
        // Refresh token invalid -> redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Both missing -> redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Block /login if already authenticated with access token
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/agent/:path*", "/vessel/:path*", "/login"],
};