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
import { Loader2 } from "lucide-react";

export default function EditModelAccount({ id }: { id: string }) {
  const router = useRouter();
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch(`/api/model-account/${id}`);
        const data = await response.json();
        if (response.ok && data.status === "success") {
          setModel(data.data);
        } else {
          toast.error(data.message || "Failed to load model details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching details");
      } finally {
        setLoading(false);
      }
    };
    fetchModel();
  }, [id]);

  const handleAction = async (status_id: number, reason: string = "") => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/model-account/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status_id, reason }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        toast.success(`Account ${status_id === 2 ? "Approved" : "Rejected"} successfully`);
        router.push("/admin/model-account");
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
  if (!model) return <div className="text-center p-10">Model not found</div>;

  return (
    <div className="mt-5 px-5">
      <div className="max-w-4xl mx-auto bg-blackfade p-8 rounded-lg shadow-xl text-white">
        <h2 className="text-36 font-semibold mb-8">Review Model Account</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Talent ID</p>
              <p className="text-xl font-medium">{model.talent_id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              <p className="text-xl font-medium">{model.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email Address</p>
              <p className="text-xl font-medium">{model.email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
             <div>
              <p className="text-gray-400 text-sm">Current Status</p>
              <p className={`text-xl font-medium ${
                model.status_id == 1 ? "text-blue-500" : 
                model.status_id == 2 ? "text-green-500" : 
                model.status_id == 3 ? "text-red-500" :
                "text-gray-500"
              }`}>
                {model.status_id == 1 ? "Pending" : 
                 model.status_id == 2 ? "Approved" : 
                 model.status_id == 3 ? "Rejected" :
                 "Unknown"}
              </p>
            </div>


          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-700 pt-8">
          <Button
            variant="outline"
            className="bg-red-600 text-white border-none hover:bg-red-700 px-8"
            onClick={() => setRejectOpen(true)}
            disabled={submitting}
          >
            Reject Account
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700 px-8"
            onClick={() => handleAction(2)}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="animate-spin" /> : "Approve Account"}
          </Button>

        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="bg-blackfade2 text-white">
          <DialogHeader>
            <DialogTitle>Reject Model Account</DialogTitle>
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
