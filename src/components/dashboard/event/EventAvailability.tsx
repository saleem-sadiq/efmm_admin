"use client";

import { useState, useEffect } from "react";
import { getEventAvailabilityColumns, EventAvailability } from "./EventAvailabilityColumns";
import ViewData from "../(tableView)/ViewData";

const EventAvailabilityComponent = ({ id }: { id: string }) => {
    const [data, setData] = useState<EventAvailability[]>([]);
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const columns = getEventAvailabilityColumns(id);

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/event/get-availability/${id}`);
                const result = await response.json();

                if (result.status === "success") {
                    setData(result.data || []);
                    setEventName(result.event_name || "");

                    if (result.event_date) {
                        setEventDate(result.event_date);
                    } else {
                        // Fallback: Fetch event details to get the date
                        const eventRes = await fetch(`/api/event/${id}`);
                        const eventData = await eventRes.json();
                        if (eventData.status === "success") {
                            setEventDate(`${eventData.data.date_start} - ${eventData.data.date_end}`);
                        }
                    }
                } else {
                    setError(result.message || "Failed to fetch availability");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAvailability();
    }, [id]);

    if (loading) return <div className="text-center p-10 mt-10">Loading availability...</div>;
    if (error) return <div className="text-center text-red-500 p-10 mt-10">Error: {error}</div>;

    return (
        <div className="mt-5 px-5">
            <div className="mb-8">
                <p className="text-36 font-semibold text-default">Event Availability</p>
                {eventName && <p className="text-xl text-whitefade mt-2">Event: {eventName}</p>}
                {eventDate && <p className="text-xl text-whitefade mt-2">Event Date: {eventDate}</p>}
            </div>

            <ViewData
                columns={columns}
                data={data}
                basePath="/admin/events/"
                rowClickable={false}
            />
        </div>
    );
};

export default EventAvailabilityComponent;
