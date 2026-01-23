"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActionProp, Event, eventColumns } from "./EventColumns";
import ViewData from "../(tableView)/ViewData";

// Function to fetch event data
async function getData(): Promise<
  Event[] | { error: string; details?: any }
> {
  try {
    const response = await fetch("/api/event/get-all-events");

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON from error response:", jsonError);
        errorDetails = { message: "Failed to parse error details" };
      }

      throw new Error(
        `Failed to fetch events: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.events || []; // Extract the events array from the response object
  } catch (error: any) {
    console.error("Error fetching events:", error.message, error.details);
    return { error: error.message, details: error.details || null };
  }
}

const Page = () => {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData();
      if ("error" in (result as any)) {
        setError((result as any).error);
      } else {
        setData(result as Event[]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Events</p>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Events</p>
        <div className="text-center text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-5 px-5">
      <p className="text-36 font-semibold text-default">Events</p>
      <ViewData
        columns={eventColumns}
        data={data}
        actionComponent={ActionProp}
        basePath="/admin/events/"
        addButton={{
          name: "Add Event",
          link: "/admin/events/add-event",
        }}
      />
    </div>
  );
};


export default Page;
