import { loginUser } from "@/services/authService";
import { NextResponse } from "next/server";

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

    // Case: success -> 200 + user data
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
