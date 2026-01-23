import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const backendDomain = process.env.BACKEND_DOMAIN;
    const cookieStore = await cookies();

    // 🔐 Get JWT token
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      cookieStore.get("token")?.value;

    const role = cookieStore.get("role")?.value;

    if (!token || role !== "admin") {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: Missing token or role" },
        { status: 401 }
      );
    }

    // 📦 Read request body
    const body = await request.json();

    // 🔁 Forward to PHP backend
    const response = await fetchWithAuth(
      `${backendDomain}/admin/event/addEvent.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
      token
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Failed to create event",
        },
        { status: response.status || 500 }
      );
    }

    // ✅ Success
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
