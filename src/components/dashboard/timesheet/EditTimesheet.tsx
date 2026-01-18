"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dancing_Script } from "next/font/google";
import { format } from "date-fns";
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export const timesheetSchema = z.object({
  talentName: z.string().min(1, "Talent name is required"),
  clientShowroom: z.string().min(1, "Showroom/Client name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  comments: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientPosition: z.string().min(1, "Client position is required"),
  agencySignature: z.string().optional(),
  talentSignature: z.string().optional(),
  clientSignature: z.string().optional(),
  rejectionReason: z.string().optional(),
});

type EditTimesheetForm = z.infer<typeof timesheetSchema>;

export default function EditTimesheet({
  timesheetId,
}: {
  timesheetId: string;
}) {
  const router = useRouter();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [talentSign, setTalentSign] = useState("");
  const [clientSign, setClientSign] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const form = useForm<EditTimesheetForm>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      talentName: "",
      clientShowroom: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      comments: "",
      clientName: "",
      clientPosition: "",
      agencySignature: "",
      rejectionReason: "",
    },
  });

  useEffect(() => {
    // Set current date
    setCurrentDate(format(new Date(), "MMM dd, yyyy"));
  }, []);

  useEffect(() => {
    // Fetch the timesheet data to populate the form
    const fetchTimesheetData = async () => {
      try {
        const response = await fetch(`/api/timesheet/${timesheetId}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message || "Failed to load timesheet data");
          return;
        }

        if (data.status !== "success" || !data.timesheet) {
          console.error("Invalid data structure:", data);
          toast.error("Invalid timesheet data received");
          return;
        }

        const timesheet = data.timesheet;

        form.reset({
          talentName: timesheet.name || "",
          clientShowroom: timesheet.client_showroom || "",
          date: timesheet.date ? new Date(timesheet.date) : new Date(),
          startTime: timesheet.start_time || "",
          endTime: timesheet.end_time || "",
          comments: timesheet.comments || "",
          clientName: timesheet.client_name || "",
          clientPosition: timesheet.client_position || "",
        });

        setTalentSign(timesheet.name || "");
        setClientSign(timesheet.client_name || "");
      } catch (error) {
        console.error("Error fetching timesheet:", error);
        toast.error("An error occurred while fetching the timesheet data");
      }
    };

    if (timesheetId) {
      fetchTimesheetData();
    }
  }, [timesheetId, form]);

  const submitAction = async (action: "approve" | "reject") => {
    const values = form.getValues();

    if (action === "approve" && !values.agencySignature) {
      toast.error("Agency signature is required");
      return;
    }

    if (action === "reject" && !values.rejectionReason) {
      toast.error("Rejection reason is required");
      return;
    }

    const payload = {
      timesheet_id: timesheetId,
      action,
      updated_data: {
        talent_name: values.talentName,
        client_name: values.clientName,
        client_showroom: values.clientShowroom,
        date: format(values.date, "yyyy-MM-dd"),
        client_position: values.clientPosition,
        start_time: values.startTime,
        end_time: values.endTime,
        comments: values.comments,
        talent_signature: talentSign,
        client_signature: clientSign,
      },
      agency_signature: values.agencySignature,
      rejection_reason: values.rejectionReason,
    };

    const res = await fetch(`/api/timesheet/${timesheetId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Action failed");
      return;
    }

    toast.success(`Timesheet ${action}d successfully`);

    // close reject dialog when action completes and navigate back to list
    setRejectOpen(false);
    router.push("/admin/timesheet");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => submitAction("approve"))}
        className="space-y-6 max-w-4xl mx-auto p-5 bg-blackfade text-white"
      >
        <h2 className="text-56 font-semibold">Timesheet</h2>
        {/* Name / Client */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="talentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Talent Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setTalentSign(e.target.value);
                    }}
                    className="bg-blackfade2 border-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientShowroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client/Showroom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Designer name"
                    {...field}
                    className="bg-blackfade2 border-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date / Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-blackfade2 border-gray-700",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
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
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="bg-blackfade2 border-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="bg-blackfade2 border-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Comments */}
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments / Suggestions From Designer</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type..."
                  className="resize-none bg-blackfade2 border-gray-700"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Signatures */}
        <div className="space-y-10">
          {/* TALENT SIGNATURE */}
          <div>
            <div className="flex items-center justify-between">
              <p className="font-semibold">TALENT SIGNATURE:</p>
              <p className="text-sm">DATE: {currentDate}</p>
            </div>
            <p
              className={`${dancingScript.className} text-2xl mt-1 text-white`}
            >
              {talentSign || "____________________"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              (Name of Talent and Guardian if under 18)
            </p>
          </div>

          {/* CLIENT SIGNATURE */}
          <div>
            <div className="flex items-center justify-between">
              <p className="font-semibold ">CLIENT SIGNATURE:</p>
              <p className="text-sm">DATE: {currentDate}</p>
            </div>
            <p
              className={`${dancingScript.className} text-2xl mt-1 text-white`}
            >
              {clientSign || "____________________"}
            </p>
          </div>
        </div>

        {/* Client Name */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter client name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setClientSign(e.target.value);
                    }}
                    className="bg-blackfade2 border-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Client Position */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="clientPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Position</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter client position with the company"
                    {...field}
                    className="bg-blackfade2 border-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="agencySignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agency Signature</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type agency signature"
                  className={`${dancingScript.className} text-2xl bg-blackfade2`}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            className="bg-default"
            onClick={() => setRejectOpen(true)}
          >
            Reject
          </Button>
          <Button type="submit" className="bg-green-700">
            Approve
          </Button>
        </div>
      </form>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="bg-blackfade2 text-white">
          <DialogHeader>
            <DialogTitle>Reject Timesheet</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Enter rejection reason"
            {...form.register("rejectionReason")}
          />

          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600"
              onClick={form.handleSubmit(() => submitAction("reject"))}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
