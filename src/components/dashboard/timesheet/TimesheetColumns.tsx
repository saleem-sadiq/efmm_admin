"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Timesheet = {
  id: number;
  talent_id: string;
  name: string;
  client_showroom: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string;
  talent_signature: string;
  client_name: string;
  client_signature: string;
  client_position: string;
  agency_signature: string | null;
  status_id: number;
  reason: string | null;
  date_created: string;
};

type ActionCellProps = {
  prop: Timesheet;
  basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop, basePath }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/${basePath}${prop.id}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Timesheet deleted successfully!");
        setOpen(false);
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete timesheet");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the timesheet");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-x-2">
        <Button variant="default" className="bg-black">
          <Link href={`${basePath}${prop.id}/edit-timesheet`}>Edit</Link>
        </Button>
        {/* <Button variant="destructive" className="bg-red-600" onClick={() => setOpen(true)}>
          Delete
        </Button> */}
      </div>

      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay />
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this timesheet?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export const timesheetColumns: ColumnDef<Timesheet>[] = [
  {
    accessorKey: "name",
    header: "Talent",
  },
  {
    accessorKey: "client_showroom",
    header: "Client / Showroom",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    header: "Time",
    cell: ({ row }) => `${row.original.start_time} - ${row.original.end_time}`,
  },
  {
    accessorKey: "client_position",
    header: "Client Position",
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate max-w-[150px]">
              {row.original.comments}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blackfade2 text-white">
            <p>{row.original.comments}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "status_id",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-sm font-medium ${
          row.original.status_id == 1
            ? "text-blue-700 bg-blue-100"
            : row.original.status_id == 2
            ? "text-green-700 bg-green-100"
            : "text-red-700 bg-red-100"
        }`}
      >
        {row.original.status_id == 1
          ? "Pending"
          : row.original.status_id == 2
          ? "Approved" 
          : "Rejected"}
      </span>
    ),
  }
];
