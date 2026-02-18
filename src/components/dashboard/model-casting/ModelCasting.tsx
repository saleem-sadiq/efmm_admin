"use client";

import { useState, useEffect } from "react";
import ViewData from "../(tableView)/ViewData";
import { modelCastingColumns, ModelCasting } from "./ModelCastingColumns";

const ModelCastingPage = () => {
    const [data, setData] = useState<ModelCasting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/model-casting/get-all");
                const result = await response.json();
                if (result.status === "success") {
                    const flattenedData = (result.castings || []).map((item: any) => ({
                        id: item.id,
                        designer_name: item.designer_info?.name || "",
                        designer_email: item.designer_info?.account_email || "",
                        event_name: item.event_details?.name || "",
                        event_location: item.event_details?.location || "",
                        event_booth: item.event_details?.booth_showroom || "",
                        event_date: item.event_details?.date || "",
                        event_time: item.event_details?.time || "",
                        company_name: item.company_details?.name || "",
                        company_email: item.company_details?.email || "",
                        company_phone: item.company_details?.phone || "",
                        sample_size: item.sample_size || "",
                        notes: item.notes || "",
                        status_id: item.status_id,
                        created_at: item.created_at
                    }));
                    const sortedData = flattenedData.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
                    setData(sortedData);
                } else {
                    setError(result.message || "Failed to fetch castings");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-white">Loading castings...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="mt-5 px-5">
            <p className="text-36 font-semibold text-default">Model Castings</p>
            <div className="mt-8">
                <ViewData
                    columns={modelCastingColumns}
                    data={data}
                    basePath="/admin/model-casting"
                    rowClickable={true}
                />
            </div>
        </div>
    );
};

export default ModelCastingPage;
