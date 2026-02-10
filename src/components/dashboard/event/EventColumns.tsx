"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Event = {
  id: number;
  name: string;
  description: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  month: string;
  location: string;
  requirements: string;
  talent_rate: string;
  directory_id: number | null;
  created_at: string;
  is_visible: boolean;
};

type ActionCellProps = {
  prop: Event;
  basePath: string;
};

import { Delete, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";

export const ActionProp: FC<ActionCellProps> = ({ prop, basePath }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/event/delete-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: prop.id }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        toast.success("Event deleted successfully");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to delete event");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the event");
    } finally {
      setIsDeleting(false);
    }
  };

  const [isToggling, setIsToggling] = useState(false);

  const handleToggleVisibility = async () => {
    setIsToggling(true);
    try {
      const response = await fetch("/api/event/toggle-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: prop.id,
          is_visible: Number(prop.is_visible) === 1 ? false : true
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        toast.success(`Event visibility ${Number(prop.is_visible) === 1 ? 'disabled' : 'enabled'}`);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to toggle visibility");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-x-2 flex items-center">
      <Button variant="default" className="bg-black text-white hover:bg-gray-800" asChild>
        <Link href={`${basePath}${prop.id}/edit-event`}>Edit</Link>
      </Button>

      <Button
        variant="outline"
        className={`px-3 py-1.5 h-auto text-xs flex items-center gap-2 ${Number(prop.is_visible) === 1 ? 'text-green-500 border-green-500 hover:bg-green-50' : 'text-gray-400 border-gray-400 hover:bg-gray-100'}`}
        onClick={(e) => {
          e.stopPropagation();
          handleToggleVisibility();
        }}
        disabled={isToggling}
        title={Number(prop.is_visible) === 1 ? "Hide Event" : "Show Event"}
      >
        {isToggling ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : Number(prop.is_visible) === 1 ? (
          <>
            <Eye className="h-3 w-3" />
            Hide
          </>
        ) : (
          <>
            <EyeOff className="h-3 w-3" />
            Show
          </>
        )}
      </Button>

      <Button
        variant="destructive"
        className="bg-red-600 text-white hover:bg-red-700 p-3"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        disabled={isDeleting}
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : `Delete`}
      </Button>
    </div>
  );
};

export const eventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Event Name",
  },
  {
    header: "Visibility",
    cell: ({ row }) => {
      const isVisible = Number(row.original.is_visible) === 1;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${isVisible
              ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
            }`}
        >
          {isVisible ? "Visible" : "Hidden"}
        </span>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    header: "Dates",
    cell: ({ row }) => `${row.original.date_start} - ${row.original.date_end}`,
  },
  {
    header: "Time",
    cell: ({ row }) => `${row.original.time_start} - ${row.original.time_end}`,
  },
  {
    accessorKey: "talent_rate",
    header: "Rate",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate max-w-[150px]">
              {row.original.description}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blackfade2 text-white">
            <p>{row.original.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  }
];
