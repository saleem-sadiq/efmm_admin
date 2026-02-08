import ModelAccountPage from "@/components/dashboard/model-account/ModelAccount";
import React from "react";

const page = () => {
    // We can pass a prop here if we want to filter by status in the future
    return <ModelAccountPage title="Existing Accounts" filterStatus={2} />;
};

export default page;
