"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { no_img } from "../../../../public/assets";


export type ModelAccount = {
  id?: string;
  talent_id: string;
  name: string;
  username: string;
  firstname: string;
  lastname: string;
  dob: string;
  email: string;
  phone: string;
  profile_picture: string;
  created_at: string;
  img: string | null;
  status_id?: number;
};

type ActionCellProps = {
  prop: ModelAccount;
  basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop, basePath }) => {
  const id = prop.id || prop.talent_id;
  return (
    <div className="space-x-2">
      <Button variant="default" className="bg-black">
        <Link href={`${basePath}${id}/edit-account`}>Review</Link>
      </Button>
    </div>
  );
};

export const modelAccountColumns: ColumnDef<ModelAccount>[] = [
  {
    header: "Profile",
    cell: ({ row }) => {
      const img = row.original.img;
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
          {img ? (
            <img src={img} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
              <img src={no_img.src} alt="profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "talent_id",
    header: "Talent ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status_id",
    header: "Status",
    cell: ({ row }) => {
      const statusId = row.original.status_id;
      if (statusId === undefined) return <span className="text-gray-500 italic">Active</span>;
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${statusId == 1
              ? "text-blue-700 bg-blue-100"
              : statusId == 2
                ? "text-green-700 bg-green-100"
                : statusId == 3
                  ? "text-red-700 bg-red-100"
                  : "text-gray-700 bg-gray-100"
            }`}
        >
          {statusId == 1 ? "Pending" : statusId == 2 ? "Approved" : statusId == 3 ? "Rejected" : "Active"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Registered At",
  },
];

