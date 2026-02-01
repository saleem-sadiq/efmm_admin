"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActionProp, ModelPost, modelPostColumns } from "./ModelPostColumns";
import ViewData from "../(tableView)/ViewData";

async function getData(): Promise<
    ModelPost[] | { error: string; details?: any }
> {
    try {
        const response = await fetch("/api/model-post/get-all-posts");

        if (!response.ok) {
            throw new Error(
                `Failed to fetch post updates: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();
        return data.posts || [];
    } catch (error: any) {
        console.error("Error fetching model posts:", error.message);
        return { error: error.message };
    }
}

const ModelPostPage = () => {
    const [data, setData] = useState<ModelPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await getData();
            if ("error" in (result as any)) {
                setError((result as any).error);
            } else {
                setData(result as ModelPost[]);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="mt-5 px-5">
                <p className="text-36 font-semibold text-default">Model Post Approvals</p>
                <div className="text-center py-10">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-5 px-5">
                <p className="text-36 font-semibold text-default">Model Post Approvals</p>
                <div className="text-center text-red-500 py-10">Error: {error}</div>
                <div className="text-center">
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-5 px-5">
            <p className="text-36 font-semibold text-default">Model Post Approvals</p>
            <ViewData
                columns={modelPostColumns}
                data={data}
                actionComponent={ActionProp}
                basePath="/admin/model-post/"
            />
        </div>
    );
};

export default ModelPostPage;
