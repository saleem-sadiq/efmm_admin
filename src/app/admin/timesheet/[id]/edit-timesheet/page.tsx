import EditTimesheet from "@/components/dashboard/timesheet/EditTimesheet";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;

  return <EditTimesheet timesheetId={id} />;
}
