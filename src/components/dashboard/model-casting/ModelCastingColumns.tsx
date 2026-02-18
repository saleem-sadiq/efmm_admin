"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ModelCasting = {
    id: number;
    designer_name: string;
    designer_email: string;
    event_name: string;
    event_location: string;
    event_booth: string;
    event_date: string;
    event_time: string;
    company_name: string;
    company_email: string;
    company_phone: string;
    sample_size: string;
    notes: string;
    status_id: number;
    created_at: string;
};

export const modelCastingColumns: ColumnDef<ModelCasting>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "event_name",
        header: "Event",
    },
    {
        accessorKey: "designer_name",
        header: "Designer",
    },
    {
        accessorKey: "company_name",
        header: "Company",
    },
    {
        accessorKey: "event_date",
        header: "Event Date",
    },
    {
        accessorKey: "status_id",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status_id;
            let statusText = "Pending";
            let statusClass = "bg-yellow-100 text-yellow-700";

            if (status == 2) {
                statusText = "Processed";
                statusClass = "bg-green-100 text-green-700";
            } else if (status == 3) {
                statusText = "Cancelled";
                statusClass = "bg-red-100 text-red-700";
            }

            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                    {statusText}
                </span>
            );
        }
    },
    {
        accessorKey: "created_at",
        header: "Requested On",
    },
];
