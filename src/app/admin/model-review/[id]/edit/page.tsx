import EditReview from "@/components/dashboard/model-review/EditReview";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <EditReview id={id} />;
};

export default page;
