import ReviewPost from "@/components/dashboard/model-post/ReviewPost";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <ReviewPost id={id} />;
};

export default page;
