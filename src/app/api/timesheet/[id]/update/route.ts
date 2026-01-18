import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Timesheet ID is required" },
        { status: 400 }
      );
    }

    // 📦 Read body from frontend
    const body = await request.json();

    const response = await fetchWithAuth(
      `${backendDomain}/admin/timesheet/updateTimesheet.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...body,
        }),
      },
      token
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Failed to update timesheet",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: data.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin timesheet update error:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
