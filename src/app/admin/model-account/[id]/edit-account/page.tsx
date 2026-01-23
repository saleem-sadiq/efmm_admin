import EditModelAccount from "@/components/dashboard/model-account/EditModelAccount";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <EditModelAccount id={id} />;
};

export default page;
