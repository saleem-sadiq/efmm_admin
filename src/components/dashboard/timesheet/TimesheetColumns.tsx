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
        <Button variant="default">
          <Link href={`${basePath}${prop.id}/edit-timesheet`}>Edit</Link>
        </Button>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay />
        <DialogContent>
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
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ActionCell: FC<ActionCellProps> = ({ prop, basePath }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      const response = await fetch(`/api${basePath}${prop.id}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Timesheet deleted successfully!");
        setOpenDeleteDialog(false);
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

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" id="deleteDialog" className="bg-blackfade2 text-white">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `${basePath}${prop.id}/edit-timesheet`;
            }}
            className="cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenDeleteDialog}
            className="cursor-pointer bg-red-500 !text-white hover:!bg-blackfade2"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={openDeleteDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDeleteDialog();
          }
        }}
      >
        <DialogOverlay />
        <DialogContent id="deleteDialogBody" className="bg-blackfade2 text-white">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this timesheet?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600"
              onClick={(e) => {
                handleDelete(e);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  },
  {
    accessorKey: "status_id",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-sm font-medium ${
          row.original.status_id == 1
            ? "text-green-700 bg-green-100"
            : "text-red-700 bg-red-100"
        }`}
      >
        {row.original.status_id == 1
          ? "Pending"
          : row.original.status_id == 2
          ? "Accepted"
          : "Rejected"}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    id: "actions",
    cell: ({ row }) => (
      <ActionCell prop={row.original} basePath="/admin/timesheet/" />
    ),
  },
];
