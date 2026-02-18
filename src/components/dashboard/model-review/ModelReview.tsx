"use client";

import { useState, useEffect } from "react";
import ViewData from "../(tableView)/ViewData";
import { modelReviewColumns, ModelReview, ActionProp } from "./ModelReviewColumns";

const ModelReviewPage = () => {
    const [data, setData] = useState<ModelReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/model-review/get-all");
                const result = await response.json();
                if (result.status === "success") {
                    const sortedData = (result.reviews || []).sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
                    setData(sortedData);
                } else {
                    setError(result.message || "Failed to fetch reviews");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-white">Loading reviews...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="mt-5 px-5">
            <p className="text-36 font-semibold text-default">Model Reviews</p>
            <div className="mt-8">
                <ViewData
                    columns={modelReviewColumns}
                    data={data}
                    basePath="/admin/model-review"
                    rowClickable={true}
                    actionComponent={ActionProp}
                />
            </div>
        </div>
    );
};

export default ModelReviewPage;
