import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const backendDomain = process.env.BACKEND_DOMAIN;
        const cookieStore = await cookies();

        // 🔐 Get JWT token
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

        // 🌐 Call backend PHP API
        const response = await fetchWithAuth(
            `${backendDomain}/admin/event/getEventById.php?id=${id}`,
            {
                method: "GET",
                cache: "no-store",
            },
            token
        );

        let data;
        try {
            data = await response.json();
        } catch (err) {
            console.error("❌ Invalid JSON from backend:", err);
            return NextResponse.json(
                { status: "error", message: "Invalid backend response" },
                { status: 500 }
            );
        }

        if (!response.ok || data.status !== "success") {
            return NextResponse.json(
                {
                    status: "error",
                    message: data.message || "Failed to fetch event details",
                },
                { status: response.status || 400 }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("❌ Error fetching event by id:", error);
        return NextResponse.json(
            { status: "error", message: error.message || "Unexpected error" },
            { status: 500 }
        );
    }
}
