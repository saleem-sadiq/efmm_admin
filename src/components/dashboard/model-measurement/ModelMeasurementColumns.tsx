"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type MeasurementUpdate = {
    id: string;
    talent_id: string;
    file_name: string;
    measurement_type: string;
    status_id: number;
    submitted_at: string;
    talent_name: string;
    firstname: string;
    lastname: string;
};

type ActionCellProps = {
    prop: MeasurementUpdate;
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

export const modelMeasurementColumns: ColumnDef<MeasurementUpdate>[] = [
    {
        accessorKey: "talent_id",
        header: "Talent ID",
    },
    {
        header: "Name",
        cell: ({ row }) => {
            const { firstname, lastname } = row.original;
            return <span>{`${firstname} ${lastname}`}</span>;
        },
    },
    {
        accessorKey: "measurement_type",
        header: "Measurement",
        cell: ({ row }) => (
            <span className="capitalize">{row.original.measurement_type?.replace(/_/g, ' ')}</span>
        )
    },
    {
        header: "Preview",
        cell: ({ row }) => {
            const backendDomain = process.env.BACKEND_DOMAIN || "http://localhost/efmm/";
            const url = `${backendDomain}Upload/model/pending/measurementPhotos/${row.original.file_name}`;
            return (
                <div className="w-16 h-16 rounded overflow-hidden bg-blackfade">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
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
                    className={`px-2 py-1 rounded-full text-sm font-medium ${statusId == 1
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
