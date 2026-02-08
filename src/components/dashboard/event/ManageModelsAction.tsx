"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Event } from "./EventColumns";

type ActionCellProps = {
    prop: Event;
    basePath: string;
};

export const ManageModelsAction: FC<ActionCellProps> = ({ prop }) => {
    return (
        <div className="space-x-2">
            <Button variant="default" className="bg-black text-white hover:bg-gray-800">
                <Link href={`/admin/events/manage-models/${prop.id}`}>View Available Models</Link>
            </Button>
        </div>
    );
};
