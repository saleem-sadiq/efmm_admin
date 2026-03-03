"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { no_img } from "../../../../public/assets";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export type EventAvailability = {
    availability_id: string;
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

const BookModelButton = ({ talentId, eventId, status, availabilityId }: { talentId: string, eventId: string, status: string, availabilityId: string }) => {
    const [loading, setLoading] = useState(false);
    const isBooked = status.toLowerCase() === "booked";

    const handleToggleStatus = async () => {
        setLoading(true);
        try {
            // status_id: 1 = Available, 3 = Booked
            const newStatusId = isBooked ? 1 : 3;
            const response = await fetch("/api/event/book-model", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    availability_id: availabilityId,
                    status_id: newStatusId,
                    talent_id: talentId,
                    event_id: eventId
                }),
            });
            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success(isBooked ? "Model marked as Available" : "Model booked successfully!");
                window.location.reload();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(); }}
            disabled={loading}
            className={`${isBooked ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white text-xs h-8 px-4`}
        >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (isBooked ? "Mark Available" : "Book Model")}
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
            const isBooked = status.toLowerCase() === "booked";
            return (
                <span className={`font-medium ${isBooked ? 'text-orange-500' : 'text-green-500'}`}>
                    {status}
                </span>
            );
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <BookModelButton
                    talentId={row.original.talent_id}
                    eventId={eventId}
                    status={row.original.status}
                    availabilityId={row.original.status.toLowerCase() === "booked" ? "1" : "3"}
                />
            );
        }
    }
];
