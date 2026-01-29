import ReviewMeasurement from "@/components/dashboard/model-measurement/ReviewMeasurement";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <ReviewMeasurement id={id} />;
};

export default page;
