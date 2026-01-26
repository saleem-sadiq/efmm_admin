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
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReviewProfileUpdate({ id }: { id: string }) {
  const router = useRouter();
  const [update, setUpdate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editedValue, setEditedValue] = useState("");

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const response = await fetch(`/api/model-profile/${id}`);
        const data = await response.json();
        if (response.ok && data.status === "success") {
          setUpdate(data.data);
          setEditedValue(data.data.new_value || "");
        } else {
          toast.error(data.message || "Failed to load update details");
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
      const response = await fetch("/api/model-profile/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          status_id, 
          reason,
          new_value: status_id === 2 ? editedValue : update.new_value 
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        toast.success(`Profile update ${status_id === 2 ? "Approved" : "Rejected"} successfully`);
        router.push("/admin/model-profile");
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

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!update) return <div className="text-center p-10">Update not found</div>;

  return (
    <div className="mt-5 px-5">
      <Link href="/admin/model-profile" className="flex items-center gap-2 text-whitefade hover:text-white mb-6">
        <ArrowLeft size={20} />
        Back to list
      </Link>
      
      <div className="max-w-4xl mx-auto bg-blackfade p-8 rounded-lg shadow-xl text-white">
        <h2 className="text-36 font-semibold mb-8">Review Profile Update</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-700 pb-8">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Talent ID</p>
              <p className="text-xl font-medium">{update.talent_id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Field Being Updated</p>
              <p className="text-xl font-medium text-default uppercase tracking-wider">{update.field_name}</p>
            </div>
          </div>
          
          <div className="space-y-4">
             <div>
              <p className="text-gray-400 text-sm">Current Status</p>
              <p className={`text-xl font-medium ${
                update.status_id == 1 ? "text-blue-500" : 
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 bg-blackfade2 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm mb-2 uppercase font-bold tracking-widest">Old Value</p>
            <div className="text-lg whitespace-pre-wrap break-words italic text-gray-300">
              {update.old_value || "Empty"}
            </div>
          </div>
          
          <div className="p-6 bg-default/10 rounded-lg border border-default/30">
            <p className="text-default text-sm mb-2 uppercase font-bold tracking-widest">New Value (Editable)</p>
            <Textarea
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="bg-blackfade border-gray-700 text-white min-h-[100px] text-lg font-semibold"
              placeholder="Enter new value..."
              disabled={submitting || update.status_id != 1}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-700 pt-8">
          <Button
            variant="outline"
            className="bg-red-600 text-white border-none hover:bg-red-700 px-8"
            onClick={() => setRejectOpen(true)}
            disabled={submitting || update.status_id != 1}
          >
            Reject Change
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700 px-8 disabled:opacity-50"
            onClick={() => handleAction(2)}
            disabled={submitting || update.status_id != 1}
          >
            {submitting ? <Loader2 className="animate-spin" /> : "Approve Change"}
          </Button>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="bg-blackfade2 text-white">
          <DialogHeader>
            <DialogTitle>Reject Profile Update</DialogTitle>
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
