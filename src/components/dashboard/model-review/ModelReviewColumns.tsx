"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Trash2, Star } from "lucide-react";

export type ModelReview = {
    id: string;
    talent_id: string;
    name: string;
    designer_id: string;
    designer_name: string;
    designer_email: string;
    rating: string;
    reviewer_name_company: string;
    event_details: string;
    comments: string;
    status_id: string;
    created_at: string;
    bc_review_id?: string;
};

type ActionCellProps = {
    prop: ModelReview;
    basePath: string;
};

export const ActionProp: FC<ActionCellProps> = ({ prop }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleUpdateStatus = async (newStatus: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/model-review/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    review_id: prop.id,
                    rating: prop.rating,
                    reviewer_name_company: prop.reviewer_name_company,
                    event_details: prop.event_details,
                    comments: prop.comments,
                    status_id: newStatus
                }),
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success("Review status updated successfully!");
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

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        setIsDeleting(true);
        try {
            const response = await fetch("/api/model-review/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    review_id: prop.id,
                    bc_review_id: prop.bc_review_id || "",
                    talent_id: prop.talent_id
                }),
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success("Review deleted successfully!");
                window.location.reload();
            } else {
                toast.error(data.message || "Failed to delete review");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-2">
            {prop.status_id == "1" && (
                <>
                    <Button
                        onClick={() => handleUpdateStatus(2)}
                        disabled={isLoading || isDeleting}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Approve
                    </Button>
                    <Button
                        onClick={() => handleUpdateStatus(3)}
                        disabled={isLoading || isDeleting}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Disapprove
                    </Button>
                </>
            )}
            {prop.status_id == "2" && (
                <Button
                    onClick={() => handleUpdateStatus(3)}
                    disabled={isLoading || isDeleting}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                    Disapprove
                </Button>
            )}
            {prop.status_id == "3" && (
                <Button
                    onClick={() => handleUpdateStatus(2)}
                    disabled={isLoading || isDeleting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                    Approve
                </Button>
            )}
            <Button
                variant="outline"
                className="bg-black text-white hover:bg-gray-800"
                asChild
            >
                <Link href={`/admin/model-review/${prop.id}/edit`}>Edit</Link>
            </Button>
            <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                {isDeleting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete
            </Button>
        </div>
    );
};

export const modelReviewColumns: ColumnDef<ModelReview>[] = [
    {
        accessorKey: "talent_id",
        header: "Talent ID",
    },
    {
        accessorKey: "name",
        header: "Model Name",
    },
    {
        accessorKey: "designer_name",
        header: "Designer",
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = parseInt(row.original.rating);
            return (
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} />
                    ))}
                </div>
            );
        }
    },
    {
        accessorKey: "reviewer_name_company",
        header: "Reviewer/Company",
    },
    {
        accessorKey: "status_id",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status_id;
            let statusText = "Pending";
            let statusClass = "bg-yellow-100 text-yellow-700";

            if (status == "2") {
                statusText = "Approved";
                statusClass = "bg-green-100 text-green-700";
            } else if (status == "3") {
                statusText = "Disapproved";
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
