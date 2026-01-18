"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActionProp, Timesheet, timesheetColumns } from "./TimesheetColumns";
import ViewData from "../(tableView)/ViewData";

// Function to fetch timesheet data
async function getData(): Promise<
  Timesheet[] | { error: string; details?: any }
> {
  try {
    const response = await fetch("/api/timesheet/get-all-timesheets"); // Adjust the API endpoint accordingly

    if (!response.ok) {
      // Attempt to parse the error details from the response
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON from error response:", jsonError);
        errorDetails = { message: "Failed to parse error details" };
      }

      throw new Error(
        `Failed to fetch timesheets: ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error: any) {
    // Log the error details for debugging
    console.error("Error fetching timesheets:", error.message, error.details);

    return { error: error.message, details: error.details || null };
  }
}

const Page = () => {
  const [data, setData] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData();
      if ("error" in result) {
        setError(result.error);
      } else {
        setData(result);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Timesheets</p>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Timesheets</p>
        <div className="text-center text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-5 px-5">
      <p className="text-36 font-semibold text-default">Timesheets</p>
      <ViewData
        columns={timesheetColumns}
        data={data}
        actionComponent={ActionProp}
        basePath="/admin/timesheet/"
      />
    </div>
  );
};

export default Page;
