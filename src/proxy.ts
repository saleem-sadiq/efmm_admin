import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const adminSigninUrl = new URL("/", request.url);

  const adminValidateTokenUrl =
    `${request.nextUrl.origin}/api/auth/token-validation`;

  /**
   * ─────────────────────────────────────────────
   * ADMIN AUTH PAGES
   * ─────────────────────────────────────────────
   */
  const adminAuthPages = [
    "/",
    "/forget-password",
  ];

  if (adminAuthPages.includes(request.nextUrl.pathname)) {
    if (token && role == "admin") {
      const isValid = await validateToken(
        token,
        adminValidateTokenUrl,
        request.headers
      );

      if (isValid) {
        return NextResponse.redirect(
          new URL("/admin/dashboard", request.url)
        );
      }
    }
    return NextResponse.next();
  }

  /**
   * ─────────────────────────────────────────────
   * PROTECT ADMIN ROUTES
   * ─────────────────────────────────────────────
   */
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token || role != "admin") {
      return NextResponse.redirect(adminSigninUrl);
    }

    const isValid = await validateToken(
      token,
      adminValidateTokenUrl,
      request.headers
    );

    if (!isValid) {
      return NextResponse.redirect(adminSigninUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * ─────────────────────────────────────────────
 * TOKEN VALIDATION HELPER
 * ─────────────────────────────────────────────
 */
async function validateToken(
  token: string,
  url: string,
  headers: Headers
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error("Admin token validation failed:", error);
    return false;
  }
}

export const config = {
  matcher: [
    "/",
    "/forget-password",
    "/admin/:path*",
  ],
};
