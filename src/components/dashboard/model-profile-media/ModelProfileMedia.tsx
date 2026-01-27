"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActionProp, MediaUpdate, modelProfileMediaColumns } from "./ModelProfileMediaColumns";
import ViewData from "../(tableView)/ViewData";

async function getData(): Promise<
  MediaUpdate[] | { error: string; details?: any }
> {
  try {
    const response = await fetch("/api/model-profile-media/get-all-pending-media");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch media updates: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.updates || [];
  } catch (error: any) {
    console.error("Error fetching media updates:", error.message);
    return { error: error.message };
  }
}

const ModelProfileMediaPage = () => {
  const [data, setData] = useState<MediaUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData();
      if ("error" in (result as any)) {
        setError((result as any).error);
      } else {
        setData(result as MediaUpdate[]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Model Media Updates</p>
        <div className="text-center py-10">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Model Media Updates</p>
        <div className="text-center text-red-500 py-10">Error: {error}</div>
        <div className="text-center">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 px-5">
      <p className="text-36 font-semibold text-default">Model Media Updates</p>
      <ViewData
        columns={modelProfileMediaColumns}
        data={data}
        actionComponent={ActionProp}
        basePath="/admin/model-profile-media/"
      />
    </div>
  );
};

export default ModelProfileMediaPage;
