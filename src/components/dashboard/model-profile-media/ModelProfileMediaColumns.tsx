"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type MediaUpdate = {
  id: string;
  talent_id: string;
  name: string;
  media_type: "image" | "video";
  file_name: string;
  status_id: number;
  submitted_at: string;
};

type ActionCellProps = {
  prop: MediaUpdate;
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

export const modelProfileMediaColumns: ColumnDef<MediaUpdate>[] = [
  {
    accessorKey: "talent_id",
    header: "Talent ID",
  },
  {
    accessorKey: "name",
    header: "Talent Name",
  },
  {
    accessorKey: "media_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize text-whitefade">{row.original.media_type}</span>
    ),
  },
  {
    accessorKey: "file_name",
    header: "Preview",
    cell: ({ row }) => {
      const type = row.original.media_type;
      const backendDomain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost/efmm/";
      const url = `${backendDomain}Upload/model/pending/modelMedia/${row.original.file_name}`;
      console.log(url);
      return (
        <div className="w-16 h-16 rounded overflow-hidden bg-blackfade">
          {type === "image" ? (
            <img src={url} alt="Media Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
              VIDEO
            </div>
          )}
        </div>
      );
    },
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
