import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export async function GET(request: Request) {
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

        // Define all backend endpoints to fetch counts from
        const endpoints = {
            modelPendingAccount: `${backendDomain}/admin/model_account/getModelAccounts.php?id=1`,
            modelActiveAccount: `${backendDomain}/admin/model_account/getModelAccounts.php?id=2`,
            modelProfile: `${backendDomain}/admin/model_profile/getAllPendingUpdates.php`,
            modelMedia: `${backendDomain}/admin/model_profile_media/getAllPendingMedia.php`,
            modelMeasurement: `${backendDomain}/admin/model_measurement/getAllPendingMeasurements.php`,
            modelPost: `${backendDomain}/admin/model_post/getAllPendingPosts.php`,
            timesheet: `${backendDomain}/admin/timesheet/getAllTimesheets.php`,
            events: `${backendDomain}/admin/event/getEvents.php`,
            inquiries: `${backendDomain}/admin/inquiry/getAllInquiries.php`,
            reviews: `${backendDomain}/admin/review/getAllReviews.php`,
            castings: `${backendDomain}/admin/casting/getAllCastingRequests.php`
        };

        const fetchCount = async (url: string, key: string) => {
            try {
                const response = await fetchWithAuth(url, { cache: "no-store" }, token);
                if (!response.ok) return 0;
                const data = await response.json();

                // Return length based on expected data structure for each endpoint
                if (key === 'modelPendingAccount') return (data.data || []).length;
                if (key === 'modelActiveAccount') return (data.data || []).length;
                if (key === 'modelProfile') return (data.data || []).length;
                if (key === 'modelMedia') return (data.data || []).length;
                if (key === 'modelMeasurement') return (data.data || []).length;
                if (key === 'modelPost') return (data.data || []).length;
                if (key === 'timesheet') return (data.timesheets || []).length;
                if (key === 'events') return (data.events || []).length;
                if (key === 'inquiries') return (data.data || []).length;
                if (key === 'reviews') return (data.data || []).length;
                if (key === 'castings') return (data.data || []).length;

                return 0;
            } catch (error) {
                console.error(`Error fetching count for ${key}:`, error);
                return 0;
            }
        };

        const [
            modelPendingAccountCount,
            modelActiveAccountCount,
            modelProfileCount,
            modelMediaCount,
            modelMeasurementCount,
            modelPostCount,
            timesheetCount,
            eventsCount,
            inquiriesCount,
            reviewsCount,
            castingsCount
        ] = await Promise.all([
            fetchCount(endpoints.modelPendingAccount, 'modelPendingAccount'),
            fetchCount(endpoints.modelActiveAccount, 'modelActiveAccount'),
            fetchCount(endpoints.modelProfile, 'modelProfile'),
            fetchCount(endpoints.modelMedia, 'modelMedia'),
            fetchCount(endpoints.modelMeasurement, 'modelMeasurement'),
            fetchCount(endpoints.modelPost, 'modelPost'),
            fetchCount(endpoints.timesheet, 'timesheet'),
            fetchCount(endpoints.events, 'events'),
            fetchCount(endpoints.inquiries, 'inquiries'),
            fetchCount(endpoints.reviews, 'reviews'),
            fetchCount(endpoints.castings, 'castings')
        ]);

        return NextResponse.json({
            status: "success",
            counts: {
                modelPendingAccount: modelPendingAccountCount,
                modelActiveAccount: modelActiveAccountCount,
                modelProfile: modelProfileCount,
                modelMedia: modelMediaCount,
                modelMeasurement: modelMeasurementCount,
                modelPost: modelPostCount,
                timesheet: timesheetCount,
                events: eventsCount,
                modelInquiry: inquiriesCount,
                modelReview: reviewsCount,
                modelCasting: castingsCount
            }
        });

    } catch (error: any) {
        console.error("❌ Error in dashboard stats route:", error);
        return NextResponse.json(
            { status: "error", message: error.message || "Unexpected error" },
            { status: 500 }
        );
    }
}
