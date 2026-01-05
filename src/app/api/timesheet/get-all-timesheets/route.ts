import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const backendDomain = process.env.BACKEND_DOMAIN;
    const cookieStore = await cookies();

    // 🔐 Get JWT token
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      cookieStore.get("token")?.value;
    const role = cookieStore.get("role")?.value;
    console.log("Fetching timesheets with role:", role + ", token present:", token);
    if (!token || !role) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: Missing token or role" },
        { status: 401 }
      );
    }

    // Fetch timesheets, passing role in the headers
    const response = await fetchWithAuth(
      `${backendDomain}/admin/timesheet/getAllTimesheets.php`,
      {
        cache: "no-cache",
        headers: {
          Cookie: `role=${role}`,
        },
      },
      token
    );

    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      return NextResponse.json(
        {
          error: "Failed to parse JSON from server",
          details: String(jsonError),
        },
        { status: 500 }
      );
    }

    // Handle non-OK responses
    if (!response.ok) {
      console.error("Server responded with an error:", data);
      return NextResponse.json(
        {
          error: `Failed to fetch care plans. Server responded with status ${response.status}`,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data.timesheets, { status: 200 });
  } catch (error) {
    console.error("Error fetching care plans:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
