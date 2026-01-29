"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Play, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { MediaUpdate } from "./ModelProfileMediaColumns";

export default function ReviewProfileMedia({ id }: { id: string }) {
    const router = useRouter();
    const [update, setUpdate] = useState<MediaUpdate | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const backendDomain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost/efmm/";
    const url = `${backendDomain}Upload/model/pending/modelMedia/`;
    useEffect(() => {
        const fetchUpdate = async () => {
            try {
                const response = await fetch(`/api/model-profile-media/${id}`);
                const data = await response.json();
                if (response.ok && data.status === "success") {
                    setUpdate(data.data);
                } else {
                    toast.error(data.message || "Failed to load media details");
                }
            } catch (error) {
                toast.error("An error occurred while fetching details");
            } finally {
                setLoading(false);
            }
        };
        fetchUpdate();
    }, [id]);

    const handleAction = async (status_id: number, reason: string = "") => {
        setSubmitting(true);
        try {
            const response = await fetch("/api/model-profile-media/approve-media", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    status_id,
                    reason
                }),
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success(`Media update ${status_id === 2 ? "Approved" : "Rejected"} successfully`);
                router.push("/admin/model-profile-media");
            } else {
                toast.error(data.message || "Action failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
            setRejectOpen(false);
        }
    };

    if (loading) return <div className="text-center p-10 text-whitefade">Loading media details...</div>;
    if (!update) return <div className="text-center p-10 text-whitefade">Media update not found</div>;

    return (
        <div className="mt-5 px-5">
            <Link href="/admin/model-profile-media" className="flex items-center gap-2 text-whitefade hover:text-white mb-6">
                <ArrowLeft size={20} />
                Back to list
            </Link>

            <div className="max-w-4xl mx-auto bg-blackfade p-8 rounded-lg shadow-xl text-white">
                <h2 className="text-36 font-semibold mb-8">Review Media Update</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-700 pb-8">
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-400 text-sm">Talent ID</p>
                            <p className="text-xl font-medium">{update.talent_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Media Type</p>
                            <p className="text-xl font-medium text-default uppercase tracking-wider flex items-center gap-2">
                                {update.media_type === "image" ? <ImageIcon size={20} /> : <Play size={20} />}
                                {update.media_type}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-400 text-sm">Current Status</p>
                            <p className={`text-xl font-medium ${update.status_id == 1 ? "text-blue-500" :
                                update.status_id == 2 ? "text-green-500" :
                                    "text-red-500"
                                }`}>
                                {update.status_id == 1 ? "Pending" :
                                    update.status_id == 2 ? "Approved" :
                                        "Rejected"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Submitted At</p>
                            <p className="text-xl font-medium">{update.submitted_at}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <p className="text-gray-400 text-sm mb-4 uppercase font-bold tracking-widest">Media Preview</p>
                    <div className="rounded-lg overflow-hidden border border-gray-800 bg-blackfade2 flex justify-center items-center min-h-[300px] w-full">
                        {update.media_type === "image" ? (
                            <img
                                src={`${url}${update.file_name}`}
                                alt="Media Update"
                                className="max-w-full max-h-[600px] object-contain"
                            />
                        ) : (
                            (() => {
                                const videoUrl = update.video_url || update.file_name;
                                const videoId = videoUrl?.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];

                                if (videoId) {
                                    return (
                                        <div className="w-full aspect-video">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                className="rounded-lg"
                                            ></iframe>
                                        </div>
                                    );
                                }

                                const isExternal = videoUrl?.startsWith("http");
                                const finalVideoUrl = isExternal ? videoUrl : `${url}${videoUrl}`;

                                return (
                                    <video
                                        src={finalVideoUrl}
                                        controls
                                        className="max-w-full max-h-[600px]"
                                    />
                                );
                            })()
                        )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 break-all">
                        {update.media_type === "image"
                            ? `URL: ${url}${update.file_name}`
                            : `Video URL: ${update.video_url || update.file_name}`}
                    </p>
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-700 pt-8">
                    <Button
                        variant="outline"
                        className="bg-red-600 text-white border-none hover:bg-red-700 px-8"
                        onClick={() => setRejectOpen(true)}
                        disabled={submitting || update.status_id != 1}
                    >
                        Reject Media
                    </Button>
                    <Button
                        className="bg-green-600 text-white hover:bg-green-700 px-8 disabled:opacity-50"
                        onClick={() => handleAction(2)}
                        disabled={submitting || update.status_id != 1}
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : "Approve Media"}
                    </Button>
                </div>
            </div>

            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="bg-blackfade2 text-white">
                    <DialogHeader>
                        <DialogTitle>Reject Media Update</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="mb-2 text-sm text-gray-400">Please provide a reason for rejection:</p>
                        <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason here..."
                            className="bg-blackfade border-gray-700 min-h-[100px]"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setRejectOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleAction(3, rejectionReason)}
                            disabled={!rejectionReason || submitting}
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : "Confirm Rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
