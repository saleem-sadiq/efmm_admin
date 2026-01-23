"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";


export type ModelAccount = {
  id: string;
  talent_id: string;
  name: string;
  email: string;
  status_id: number;
};

type ActionCellProps = {
  prop: ModelAccount;
  basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop, basePath }) => {
  return (
    <div className="space-x-2">
      <Button variant="default" className="bg-black">
        <Link href={`${basePath}${prop.id}/edit-account`}>Edit</Link>
      </Button>
    </div>
  );
};



export const modelAccountColumns: ColumnDef<ModelAccount>[] = [
  {
    accessorKey: "talent_id",
    header: "Talent ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
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
              : statusId == 3
              ? "text-red-700 bg-red-100"
              : "text-gray-700 bg-gray-100"
          }`}
        >
          {statusId == 1 ? "Pending" : statusId == 2 ? "Approved" : statusId == 3 ? "Rejected" : "Unknown"}
        </span>
      );
    },


  },
];

