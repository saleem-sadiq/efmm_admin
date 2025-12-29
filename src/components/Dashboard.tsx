import type React from "react"
import { Users, Award as IdCard, Info, ImageIcon, Play, Pencil, Calendar, FileText } from "lucide-react"

interface RequestCardProps {
  icon: React.ElementType
  count: number
  label: string
}

function RequestCard({ icon: Icon, count, label }: RequestCardProps) {
  return (
    <div className="bg-default text-white p-6 rounded-lg shadow-sm flex flex-col justify-between min-h-[160px]">
      <div className="flex items-center gap-4">
        <Icon className="w-10 h-10" strokeWidth={1.5} />
        <span className="text-4xl font-light">{count}</span>
      </div>
      <div className="text-sm font-bold tracking-wider mt-4">{label.toUpperCase()}</div>
    </div>
  )
}

const Dashboard = () => {
  const requests = [
    { icon: Users, count: 3, label: "Model Account" },
    { icon: IdCard, count: 3, label: "Model Bio" },
    { icon: Info, count: 0, label: "Model Info" },
    { icon: ImageIcon, count: 1, label: "Model Images" },
    { icon: Play, count: 1, label: "Model Videos" },
    { icon: Pencil, count: 1, label: "Model Measurements" },
    { icon: Calendar, count: 1, label: "Events/Casting Calls" },
    { icon: FileText, count: 0, label: "Timesheets" },
    { icon: FileText, count: 3, label: "Blogs" },
    { icon: FileText, count: 3, label: "Posts" },
  ]

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl mb-8 font-normal">Pending Request</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-full">
        {requests.map((request, index) => (
          <RequestCard key={index} {...request} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard;
