import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const cookies = request.headers.get("cookie"); // Extract cookies from the request

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "No token provided" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const validateTokenUrl = `${process.env.BACKEND_DOMAIN}/admin/auth/validate_token/valid_admin.php`;
    const response = await fetch(validateTokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: cookies || "",
      },
      credentials: "include",
    });

    const raw = await response.text();

    if (!raw) {
      console.error("Empty response from backend");
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const result = JSON.parse(raw);

    if (!response.ok || result.valid !== true) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Admin token validation error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
