import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;
  if (!BACKEND_DOMAIN) {
    console.error("BACKEND_DOMAIN is not set in environment");
    return NextResponse.json(
      { error: "Server misconfiguration: BACKEND_DOMAIN not set" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log("BACKEND_DOMAIN:", BACKEND_DOMAIN);
    // Forward request to PHP backend
    const response = await fetch(`${BACKEND_DOMAIN}/admin/auth/signin.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok || result.status === "error") {
      return NextResponse.json(
        { error: result.message || "Admin login failed" },
        { status: 400 }
      );
    }

    // Destructure backend response
    const { token, role, username, email, admin_id } = result;

    const maxAge = 60 * 60 * 24 * 7; // 7 days

    // Create response
    const res = NextResponse.json(
      {
        message: "Admin login successful",
        username,
        email,
        role,
      },
      { status: 200 }
    );

    /**
     * IMPORTANT:
     * - token should ideally be httpOnly (more secure)
     * - role / username / id can be non-httpOnly
     */

    // JWT cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      maxAge,
      path: "/",
      sameSite: "strict",
    });

    // Role cookie
    res.cookies.set("role", role, {
      httpOnly: false,
      secure: true,
      maxAge,
      path: "/",
      sameSite: "strict",
    });

    // Admin ID
    res.cookies.set("admin_id", String(admin_id), {
      httpOnly: false,
      secure: true,
      maxAge,
      path: "/",
      sameSite: "strict",
    });

    // Username
    res.cookies.set("username", username, {
      httpOnly: false,
      secure: true,
      maxAge,
      path: "/",
      sameSite: "strict",
    });

    return res;
  } catch (error) {
    console.error("Admin signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
