import { signAccessToken, verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const refreshToken = request.headers.get("cookie")
      ?.split("; ")
      .find((row) => row.startsWith("refresh_token="))
      ?.split("=")[1];

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
    }

    const payload = verifyToken(refreshToken);

    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    // Generate new access token
    const newAccessToken = signAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const response = NextResponse.json({ message: "Token refreshed" }, { status: 200 });

    // Set new access token cookie
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
