import EditEvent from "@/components/dashboard/event/EditEvent";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <EditEvent id={id} />;
};

export default page;
