"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Props = {
  id: number;
  initialStatus: "pending" | "approved" | "rejected";
};

export default function TimesheetStatusCell({ id, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: Props["initialStatus"]) => {
    if (newStatus === status) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/timesheets/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setStatus(newStatus);
      toast.success(`Timesheet ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="none"
          className={`px-4 py-1 rounded-full text-sm ${
            status === "pending"
              ? "bg-orange-100 text-orange-700"
              : status === "approved"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {["pending", "approved", "rejected"].map((s) => (
          <DropdownMenuItem
            key={s}
            disabled={loading || status === s}
            onClick={() => updateStatus(s as any)}
          >
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
