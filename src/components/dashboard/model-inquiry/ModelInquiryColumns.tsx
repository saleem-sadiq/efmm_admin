"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ModelInquiry = {
    id: string;
    talent_id: string;
    model_name: string;
    designer_name: string;
    company_name: string;
    company_phone: string;
    booking_type: string;
    created_at: string;
    status_id: string;
};

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ActionCellProps = {
    prop: ModelInquiry;
    basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateStatus = async (newStatus: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/model-inquiry/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inquiry_id: prop.id, status_id: newStatus }),
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
            {prop.status_id == "1" && (
                <>
                    <Button
                        onClick={() => handleUpdateStatus(2)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Available
                    </Button>
                    <Button
                        onClick={() => handleUpdateStatus(3)}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Unavailable
                    </Button>
                </>
            )}
            {prop.status_id == "2" && (
                <>
                    <Button
                        onClick={() => handleUpdateStatus(1)}
                        disabled={isLoading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Pending
                    </Button>
                    <Button
                        onClick={() => handleUpdateStatus(3)}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Unavailable
                    </Button>
                </>
            )}
            {prop.status_id == "3" && (
                <>
                    <Button
                        onClick={() => handleUpdateStatus(1)}
                        disabled={isLoading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Pending
                    </Button>
                    <Button
                        onClick={() => handleUpdateStatus(2)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Available
                    </Button>
                </>
            )}
        </div>
    );
};

export const modelInquiryColumns: ColumnDef<ModelInquiry>[] = [
    {
        accessorKey: "talent_id",
        header: "Talent Id",
    },
    {
        accessorKey: "model_name",
        header: "Model Name",
    },
    {
        accessorKey: "designer_name",
        header: "Designer Name",
    },
    {
        accessorKey: "company_name",
        header: "Company Name",
    },
    {
        accessorKey: "company_phone",
        header: "Phone",
    },
    {
        accessorKey: "booking_type",
        header: "Booking Type",
    },
    {
        accessorKey: "status_id",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status_id;
            let statusText = "Pending";
            let statusClass = "bg-yellow-100 text-yellow-700";

            if (status == "2") {
                statusText = "Available";
                statusClass = "bg-green-100 text-green-700";
            } else if (status == "3") {
                statusText = "Unavailable";
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
        header: "Date",
    },
];

