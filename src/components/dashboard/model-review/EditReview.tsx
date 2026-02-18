"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2, ArrowLeft, Star } from "lucide-react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const reviewSchema = z.object({
    rating: z.string().min(1, "Rating is required"),
    reviewer_name_company: z.string().min(1, "Reviewer/Company is required"),
    event_details: z.string().min(1, "Event details are required"),
    comments: z.string().min(1, "Comments are required"),
    status_id: z.string().min(1, "Status is required"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface EditReviewProps {
    id: string;
}

export default function EditReview({ id }: EditReviewProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: "5",
            reviewer_name_company: "",
            event_details: "",
            comments: "",
            status_id: "1",
        },
    });

    useEffect(() => {
        async function fetchReviewDetails() {
            try {
                const response = await fetch(`/api/model-review/${id}`);
                const data = await response.json();

                if (response.ok && data.status === "success") {
                    const review = data.review;
                    form.reset({
                        rating: String(review.rating || "5"),
                        reviewer_name_company: review.reviewer_name_company || "",
                        event_details: review.event_details || "",
                        comments: review.comments || "",
                        status_id: String(review.status_id || "1"),
                    });
                } else {
                    toast.error(data.message || "Failed to load review details");
                }
            } catch (error) {
                toast.error("An error occurred while fetching details");
            } finally {
                setFetching(false);
            }
        }

        fetchReviewDetails();
    }, [id, form]);

    async function onSubmit(values: ReviewFormValues) {
        setLoading(true);
        try {
            const payload = {
                review_id: id,
                ...values,
            };

            const response = await fetch("/api/model-review/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update review");
            }

            toast.success("Review updated successfully!");
            router.push("/admin/model-review");
        } catch (error: any) {
            console.error("Error updating review:", error);
            toast.error(error.message || "An error occurred while updating the review");
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
            <Link href="/admin/model-review" className="flex items-center gap-2 text-whitefade hover:text-white mb-6">
                <ArrowLeft size={20} />
                Back to list
            </Link>

            <div className="max-w-4xl mx-auto bg-blackfade p-8 rounded-lg shadow-xl text-white">
                <h2 className="text-36 font-semibold mb-8">Edit Review</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating (1-5)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-blackfade2 border-gray-700">
                                                    <SelectValue placeholder="Select rating" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-black border-gray-700 text-white">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <SelectItem key={num} value={String(num)}>
                                                        <div className="flex items-center">
                                                            {num} <Star className="ml-2 w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-blackfade2 border-gray-700">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-black border-gray-700 text-white">
                                                <SelectItem value="1">Pending</SelectItem>
                                                <SelectItem value="2">Approved</SelectItem>
                                                <SelectItem value="3">Disapproved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="reviewer_name_company"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reviewer Name / Company</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. John Doe / ABC Agency"
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
                            name="event_details"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Details</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Milan Fashion Week 2024"
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
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Reviewer comments..."
                                            className="bg-blackfade2 border-gray-700 min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4 gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/model-review")}
                                className="border-gray-700 hover:bg-gray-800 text-white"
                            >
                                Cancel
                            </Button>
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
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
