"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type ProfileUpdate = {
  id: string;
  talent_id: string;
  field_name: string;
  old_value: string;
  new_value: string;
  status_id: number;
  submitted_at: string;
};

type ActionCellProps = {
  prop: ProfileUpdate;
  basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop, basePath }) => {
  return (
    <div className="space-x-2">
      <Button variant="default" className="bg-black">
        <Link href={`${basePath}${prop.id}/review`}>Review</Link>
      </Button>
    </div>
  );
};

export const modelProfileColumns: ColumnDef<ProfileUpdate>[] = [
  {
    accessorKey: "talent_id",
    header: "Talent ID",
  },
  {
    accessorKey: "field_name",
    header: "Field Name",
  },
  {
    accessorKey: "old_value",
    header: "Old Value",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate" title={row.original.old_value}>
        {row.original.old_value}
      </div>
    ),
  },
  {
    accessorKey: "new_value",
    header: "New Value",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate font-semibold text-white" title={row.original.new_value}>
        {row.original.new_value}
      </div>
    ),
  },
  {
    accessorKey: "status_id",
    header: "Status",
    cell: ({ row }) => {
      const statusId = row.original.status_id;
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            statusId == 1
              ? "text-blue-700 bg-blue-100"
              : statusId == 2
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          }`}
        >
          {statusId == 1 ? "Pending" : statusId == 2 ? "Approved" : "Rejected"}
        </span>
      );
    },
  },
  {
    accessorKey: "submitted_at",
    header: "Submitted At",
  },
];
