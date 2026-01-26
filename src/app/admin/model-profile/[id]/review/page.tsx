import ReviewProfileUpdate from "@/components/dashboard/model-profile/ReviewProfileUpdate";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ReviewProfileUpdate id={id} />;
};

export default page;
