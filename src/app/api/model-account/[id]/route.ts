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

        const token =
            request.headers.get("authorization")?.replace("Bearer ", "") ||
            cookieStore.get("token")?.value;
        const role = cookieStore.get("role")?.value;

        if (!token || role !== "admin") {
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetchWithAuth(
            `${backendDomain}/admin/model_account/getModelAccountById.php?id=${id}`,
            {
                method: "GET",
                cache: "no-store",
            },
            token
        );

        const data = await response.json();

        if (!response.ok || data.status !== "success") {
            return NextResponse.json(
                { status: "error", message: data.message || "Failed to fetch model details" },
                { status: response.status || 400 }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("❌ Error in get-model-by-id:", error);
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
