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

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ActionCellProps = {
    prop: ModelCasting;
    basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateStatus = async (newStatus: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/model-casting/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ casting_id: prop.id, status_id: newStatus }),
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success("Status updated successfully!");
                window.location.reload();
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            {prop.status_id == 1 && (
                <>
                    <Button
                        onClick={() => handleUpdateStatus(2)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Confirmed
                    </Button>
                    <Button
                        onClick={() => handleUpdateStatus(3)}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Cancelled
                    </Button>
                </>
            )}
            {prop.status_id == 2 && (
                <Button
                    onClick={() => handleUpdateStatus(3)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                    Cancelled
                </Button>
            )}
            {prop.status_id == 3 && (
                <Button
                    onClick={() => handleUpdateStatus(2)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                    Confirmed
                </Button>
            )}
        </div>
    );
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
                statusText = "Confirmed";
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
