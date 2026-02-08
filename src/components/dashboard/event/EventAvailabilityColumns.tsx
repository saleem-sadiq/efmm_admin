"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { no_img } from "../../../../public/assets";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export type EventAvailability = {
    talent_id: string;
    name: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    username: string;
    img: string | null;
    status: string;
};

const BookModelButton = ({ talentId, eventId }: { talentId: string, eventId: string }) => {
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/event/book-model", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ talent_id: talentId, event_id: eventId }),
            });
            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success("Model booked successfully!");
            } else {
                toast.error(data.message || "Booking failed");
            }
        } catch (error) {
            toast.error("An error occurred during booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={(e) => { e.stopPropagation(); handleBook(); }}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-4"
        >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Book Model"}
        </Button>
    );
};

export const getEventAvailabilityColumns = (eventId: string): ColumnDef<EventAvailability>[] => [
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <span className="text-green-500 font-medium">
                    {status}
                </span>
            );
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return <BookModelButton talentId={row.original.talent_id} eventId={eventId} />;
        }
    }
];
