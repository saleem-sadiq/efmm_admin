import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export async function GET(request: Request) {
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

        // 🌐 Call backend PHP API (using GET now)
        const response = await fetchWithAuth(
            `${backendDomain}/admin/event/getAllEvents.php`,
            {
                method: "GET",
                cache: "no-store",
                headers: { Cookie: `role=${role}` },
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

        // 🧠 Handle backend errors
        if (!response.ok || data.status === "error") {
            return NextResponse.json(
                {
                    status: "error",
                    message: data.message || "Backend error",
                },
                { status: response.status || 400 }
            );
        }

        // ✅ Normalize and return clean JSON
        return NextResponse.json(
            {
                status: "success",
                total_events: data.total_events || 0,
                events: data.events || [],
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("❌ Error in get-all-events route:", error);
        return NextResponse.json(
            { status: "error", message: error.message || "Unexpected error" },
            { status: 500 }
        );
    }
}