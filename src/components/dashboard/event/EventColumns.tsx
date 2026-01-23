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
};

type ActionCellProps = {
  prop: Event;
  basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop, basePath }) => {
  return (
    <div className="space-x-2">
      <Button variant="default" className="bg-black">
        <Link href={`${basePath}${prop.id}/edit-event`}>Edit</Link>
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
