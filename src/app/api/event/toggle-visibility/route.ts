import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const backendDomain = process.env.BACKEND_DOMAIN;
        const cookieStore = await cookies();

        const token =
            request.headers.get("authorization")?.replace("Bearer ", "") ||
            cookieStore.get("token")?.value;

        const role = cookieStore.get("role")?.value;

        if (!token || role !== "admin") {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { event_id, is_visible } = body;

        if (event_id === undefined || is_visible === undefined) {
            return NextResponse.json(
                { status: "error", message: "event_id and is_visible are required" },
                { status: 400 }
            );
        }

        // Forward to backend PHP API
        const response = await fetchWithAuth(
            `${backendDomain}/admin/event/toggleEventVisibility.php`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ event_id, is_visible }),
            },
            token
        );

        let data;
        try {
            data = await response.json();
        } catch (err) {
            return NextResponse.json(
                { status: "error", message: "Invalid backend response" },
                { status: 500 }
            );
        }

        if (!response.ok || data.status !== "success") {
            return NextResponse.json(
                {
                    status: "error",
                    message: data.message || "Failed to toggle visibility",
                },
                { status: response.status || 500 }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("❌ Error toggling event visibility:", error);
        return NextResponse.json(
            { status: "error", message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
