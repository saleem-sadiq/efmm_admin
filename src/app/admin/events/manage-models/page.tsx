"use client";
import { useState, useEffect } from "react";
import { Event, eventColumns } from "@/components/dashboard/event/EventColumns";
import ViewData from "@/components/dashboard/(tableView)/ViewData";
import { ManageModelsAction } from "@/components/dashboard/event/ManageModelsAction";

async function getEvents(): Promise<Event[] | { error: string }> {
    try {
        const response = await fetch("/api/event/get-all-events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        return data.events || [];
    } catch (error: any) {
        return { error: error.message };
    }
}

const ManageModelsListPage = () => {
    const [data, setData] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await getEvents();
            if ("error" in (result as any)) {
                setError((result as any).error);
            } else {
                const sortedEvents = (result as Event[]).sort((a, b) => b.id - a.id);
                setData(sortedEvents);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading events...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="mt-5 px-5">
            <p className="text-36 font-semibold text-default">Manage Models for Events</p>
            <p className="text-whitefade mt-2 mb-8">Select an event to view models who have marked themselves available.</p>

            <ViewData
                columns={eventColumns}
                data={data}
                actionComponent={ManageModelsAction}
                basePath="/admin/events/manage-models/"
            />
        </div>
    );
};

export default ManageModelsListPage;
