"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActionProp, ModelAccount, modelAccountColumns } from "./ModelAccountColumns";
import ViewData from "../(tableView)/ViewData";

async function getData(): Promise<
  ModelAccount[] | { error: string; details?: any }
> {
  try {
    const response = await fetch("/api/model-account/get-all-model-accounts");

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (jsonError) {
        errorDetails = { message: "Failed to parse error details" };
      }
      throw new Error(
        `Failed to fetch models: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.models || [];
  } catch (error: any) {
    console.error("Error fetching models:", error.message);
    return { error: error.message };
  }
}

const ModelAccountPage = () => {
  const [data, setData] = useState<ModelAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData();
      if ("error" in (result as any)) {
        setError((result as any).error);
      } else {
        setData(result as ModelAccount[]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Model Accounts</p>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Model Accounts</p>
        <div className="text-center text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 px-5">
      <p className="text-36 font-semibold text-default">Model Accounts</p>
      <ViewData
        columns={modelAccountColumns}
        data={data}
        actionComponent={ActionProp}
        basePath="/admin/model-account/"
      />

    </div>
  );
};

export default ModelAccountPage;
