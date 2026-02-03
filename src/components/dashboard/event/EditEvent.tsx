"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import * as z from "zod";
import { CalendarIcon, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const eventSchema = z.object({
    event_name: z.string().min(1, "Event name is required"),
    event_desc: z.string().min(1, "Description is required"),
    event_location: z.string().min(1, "Location is required"),
    event_req: z.string().min(1, "Requirements are required"),
    talent_rate: z.string().min(1, "Talent rate is required"),
    event_date_start: z.date({
        required_error: "Start date is required",
    }),
    event_date_end: z.date({
        required_error: "End date is required",
    }),
    event_time_start: z.string().min(1, "Start time is required"),
    event_time_end: z.string().min(1, "End time is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EditEventProps {
    id: string;
}

export default function EditEvent({ id }: EditEventProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            event_name: "",
            event_desc: "",
            event_location: "",
            event_req: "",
            talent_rate: "",
            event_time_start: "",
            event_time_end: "",
        },
    });

    const convertTo24Hour = (timeStr: string) => {
        if (!timeStr) return "";
        if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

        const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return timeStr;

        let [_, hours, minutes, modifier] = match;
        let h = parseInt(hours, 10);

        if (modifier.toUpperCase() === "PM" && h < 12) h += 12;
        if (modifier.toUpperCase() === "AM" && h === 12) h = 0;

        return `${h.toString().padStart(2, "0")}:${minutes}`;
    };

    useEffect(() => {
        async function fetchEventDetails() {
            try {
                const response = await fetch(`/api/event/${id}`);
                const data = await response.json();

                if (response.ok && data.status === "success") {
                    const event = data.data;
                    form.reset({
                        event_name: event.name || "",
                        event_desc: event.description || "",
                        event_location: event.location || "",
                        event_req: event.requirements || "",
                        talent_rate: event.talent_rate || "",
                        event_date_start: parseISO(event.date_start),
                        event_date_end: parseISO(event.date_end),
                        event_time_start: convertTo24Hour(event.time_start),
                        event_time_end: convertTo24Hour(event.time_end),
                    });
                } else {
                    toast.error(data.message || "Failed to load event details");
                }
            } catch (error) {
                toast.error("An error occurred while fetching details");
            } finally {
                setFetching(false);
            }
        }

        fetchEventDetails();
    }, [id, form]);

    async function onSubmit(values: EventFormValues) {
        setLoading(true);
        try {
            const payload = {
                id,
                ...values,
                event_date_start: format(values.event_date_start, "yyyy-MM-dd"),
                event_date_end: format(values.event_date_end, "yyyy-MM-dd"),
            };

            const response = await fetch("/api/event/edit-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update event");
            }

            toast.success("Event updated successfully!");
            router.push("/admin/events");
        } catch (error: any) {
            console.error("Error updating event:", error);
            toast.error(error.message || "An error occurred while updating the event");
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-whitefade" />
            </div>
        );
    }

    return (
        <div className="mt-5 px-5">
            <Link href="/admin/events" className="flex items-center gap-2 text-whitefade hover:text-white mb-6">
                <ArrowLeft size={20} />
                Back to list
            </Link>

            <div className="max-w-4xl mx-auto bg-blackfade p-8 rounded-lg shadow-xl text-white">
                <h2 className="text-36 font-semibold mb-8">Edit Event</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="event_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Summer Fashion Gala"
                                                className="bg-blackfade2 border-gray-700"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="event_location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. New York Convention Center"
                                                className="bg-blackfade2 border-gray-700"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="event_desc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the event details..."
                                            className="bg-blackfade2 border-gray-700 min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_req"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requirements</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Special requirements for talent..."
                                            className="bg-blackfade2 border-gray-700 min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="talent_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Talent Rate</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. $500/day"
                                                className="bg-blackfade2 border-gray-700"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="event_time_start"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    className="bg-blackfade2 border-gray-700"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="event_time_end"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    className="bg-blackfade2 border-gray-700"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="event_date_start"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-blackfade2 border-gray-700 hover:bg-blackfade2/80 hover:text-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    className="bg-white"
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="event_date_end"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-blackfade2 border-gray-700 hover:bg-blackfade2/80 hover:text-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    className="bg-white"
                                                    disabled={(date) =>
                                                        date < (form.getValues("event_date_start") || new Date(0))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="bg-white text-black hover:bg-gray-200 min-w-[150px]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Event"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
