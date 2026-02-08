import EventAvailabilityComponent from "@/components/dashboard/event/EventAvailability";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <EventAvailabilityComponent id={id} />;
};

export default page;
