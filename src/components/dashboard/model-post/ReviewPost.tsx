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
import { Loader2, ArrowLeft, Play, ImageIcon, User } from "lucide-react";
import Link from "next/link";
import { ModelPost } from "./ModelPostColumns";

export default function ReviewPost({ id }: { id: string }) {
    const router = useRouter();
    const [post, setPost] = useState<ModelPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/model-post/${id}`);
                const data = await response.json();
                if (response.ok && data.status === "success") {
                    setPost(data.data);
                } else {
                    toast.error(data.message || "Failed to load post details");
                }
            } catch (error) {
                toast.error("An error occurred while fetching details");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleAction = async (status_id: number, reason: string = "") => {
        setSubmitting(true);
        try {
            const response = await fetch("/api/model-post/approve-post", {
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
                toast.success(`Post ${status_id === 2 ? "Approved" : "Rejected"} successfully`);
                router.push("/admin/model-post");
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

    if (loading) return <div className="text-center p-10 text-whitefade">Loading post details...</div>;
    if (!post) return <div className="text-center p-10 text-whitefade">Post not found</div>;

    return (
        <div className="mt-5 px-5">
            <Link href="/admin/model-post" className="flex items-center gap-2 text-whitefade hover:text-white mb-6">
                <ArrowLeft size={20} />
                Back to list
            </Link>

            <div className="max-w-4xl mx-auto bg-blackfade p-8 rounded-lg shadow-xl text-white">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-36 font-semibold">Review Model Post</h2>
                    <div className="flex items-center gap-3 bg-default/10 px-4 py-2 rounded-full border border-default/30">
                        <User size={18} className="text-default" />
                        <span className="font-medium">{post.firstname} {post.lastname}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-700 pb-8">
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-400 text-sm">Talent ID</p>
                            <p className="text-xl font-medium">{post.talent_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Username</p>
                            <p className="text-xl font-medium text-default">@{post.username}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-400 text-sm">Current Status</p>
                            <p className={`text-xl font-medium ${post.status_id == "1" ? "text-blue-500" :
                                post.status_id == "2" ? "text-green-500" :
                                    "text-red-500"
                                }`}>
                                {post.status_id == "1" ? "Pending Approval" :
                                    post.status_id == "2" ? "Approved" :
                                        "Rejected"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Submitted At</p>
                            <p className="text-xl font-medium">{post.created_at}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <p className="text-gray-400 text-sm mb-2 uppercase font-bold tracking-widest">Caption</p>
                    <div className="p-4 bg-blackfade2 rounded-lg border border-gray-800 text-lg italic text-gray-200 whitespace-pre-wrap">
                        {post.caption || "No caption provided"}
                    </div>
                </div>

                <div className="mb-10">
                    <p className="text-gray-400 text-sm mb-4 uppercase font-bold tracking-widest">Post Media ({post.media?.length || 0})</p>
                    {post.media && post.media.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {post.media.map((item) => (
                                <div key={item.id} className="rounded-lg overflow-hidden border border-gray-800 bg-blackfade2">
                                    {item.media_type === "image" ? (
                                        <div className="relative aspect-square">
                                            <img
                                                src={item.url}
                                                alt="Post Media"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative aspect-square">
                                            <video
                                                src={item.url}
                                                controls
                                                className="w-full h-full object-contain bg-black"
                                            />
                                        </div>
                                    )}
                                    <div className="p-2 text-[10px] text-gray-500 truncate bg-black/20">
                                        {item.media_file}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center border border-dashed border-gray-700 rounded-lg text-gray-500">
                            This post contains no media.
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-700 pt-8">
                    <Button
                        variant="outline"
                        className="bg-red-600 text-white border-none hover:bg-red-700 px-8"
                        onClick={() => setRejectOpen(true)}
                        disabled={submitting || post.status_id != "1"}
                    >
                        Reject Post
                    </Button>
                    <Button
                        className="bg-green-600 text-white hover:bg-green-700 px-8 disabled:opacity-50"
                        onClick={() => handleAction(2)}
                        disabled={submitting || post.status_id != "1"}
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : "Approve Post"}
                    </Button>
                </div>
            </div>

            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="bg-blackfade2 text-white">
                    <DialogHeader>
                        <DialogTitle>Reject Model Post</DialogTitle>
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
