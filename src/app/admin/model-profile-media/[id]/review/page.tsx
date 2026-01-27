import ReviewProfileMedia from "@/components/dashboard/model-profile-media/ReviewProfileMedia";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ReviewProfileMedia id={id} />;
};

export default page;
