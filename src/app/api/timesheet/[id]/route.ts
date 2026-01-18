import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
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
        { status: "error", message: "Timesheet ID is requiredss" },
        { status: 400 }
      );
    }

    const response = await fetchWithAuth(
      `${backendDomain}/admin/timesheet/getTimesheetById.php?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      },
      token
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Failed to fetch timesheet",
        },
        { status: 500 }
      );
    }

    // 4️⃣ Success
    return NextResponse.json(
      {
        status: "success",
        timesheet: data.timesheet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching timesheet by ID:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
