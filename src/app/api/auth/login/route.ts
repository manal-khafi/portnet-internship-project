import { loginUser } from "@/services/authService";
import { NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    // Case: user not found -> 404
    if (result.error === "User does not exist") {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // Case: wrong password -> 401
    if (result.error === "Invalid password") {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Generate tokens
    const payload = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Case: success -> 200 + user data + httpOnly cookies
    const { password: _, ...userWithoutPassword } = result.user;
    const response = NextResponse.json({ user: userWithoutPassword }, { status: 200 });
    
    // Set Access Token
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    // Set Refresh Token
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
