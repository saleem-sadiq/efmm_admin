"use client";

import { useState, useEffect } from "react";
import ViewData from "../(tableView)/ViewData";
import { modelInquiryColumns, ModelInquiry, ActionProp } from "./ModelInquiryColumns";

const ModelInquiryPage = () => {
    const [data, setData] = useState<ModelInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/model-inquiry/get-all");
                const result = await response.json();
                if (result.status === "success") {
                    // Sort by ID descending by default
                    const sortedData = (result.inquiries || []).sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
                    setData(sortedData);
                } else {
                    setError(result.message || "Failed to fetch inquiries");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-white">Loading inquiries...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="mt-5 px-5">
            <p className="text-36 font-semibold text-default">Model Inquiries</p>
            <div className="mt-8">
                <ViewData
                    columns={modelInquiryColumns}
                    data={data}
                    basePath="/admin/model-inquiry"
                    rowClickable={true}
                    actionComponent={ActionProp}
                />
            </div>
        </div>
    );
};

export default ModelInquiryPage;
