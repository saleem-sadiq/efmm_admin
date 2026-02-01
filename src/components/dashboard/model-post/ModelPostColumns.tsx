"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageIcon, Play } from "lucide-react";

export type PostMedia = {
    id: number;
    post_id: number;
    media_file: string;
    media_type: "image" | "video";
    url: string;
};

export type ModelPost = {
    id: string;
    talent_id: string;
    caption: string;
    status_id: string;
    created_at: string;
    username: string;
    firstname: string;
    lastname: string;
    media: PostMedia[];
};

type ActionCellProps = {
    prop: ModelPost;
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

export const modelPostColumns: ColumnDef<ModelPost>[] = [
    {
        accessorKey: "talent_id",
        header: "Talent ID",
    },
    {
        header: "Talent Name",
        cell: ({ row }) => {
            const { firstname, lastname } = row.original;
            return <span>{`${firstname} ${lastname}`}</span>;
        },
    },
    {
        accessorKey: "caption",
        header: "Caption",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate" title={row.original.caption}>
                {row.original.caption || <span className="text-gray-500 italic">No caption</span>}
            </div>
        ),
    },
    {
        header: "Media Count",
        cell: ({ row }) => {
            const count = row.original.media?.length || 0;
            return <span>{count} items</span>;
        },
    },
    {
        header: "Preview",
        cell: ({ row }) => {
            const media = row.original.media?.[0];
            if (!media) return <div className="w-16 h-16 bg-blackfade rounded flex items-center justify-center text-[10px] text-gray-500">NO MEDIA</div>;

            return (
                <div className="w-16 h-16 rounded overflow-hidden bg-blackfade relative group">
                    {media.media_type === "image" ? (
                        <img src={media.url} alt="Post Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/40">
                            <Play size={16} className="text-white" />
                        </div>
                    )}
                    {row.original.media.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 rounded-tl">
                            +{row.original.media.length - 1}
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
            const statusId = parseInt(row.original.status_id);
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
        accessorKey: "created_at",
        header: "Created At",
    },
];
