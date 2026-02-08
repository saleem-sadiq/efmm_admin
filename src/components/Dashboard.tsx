"use client";

import React, { useEffect, useState } from "react";
import {
  BellRing,
  Calendar,
  FileText,
  ImageIcon,
  Pencil,
  UserRound,
  UserRoundPen,
  Loader2,
} from "lucide-react";

import Link from "next/link";

interface RequestCardProps {
  icon: React.ElementType;
  count: number;
  label: string;
  link: string;
}

function RequestCard({ icon: Icon, count, label, link }: RequestCardProps) {
  return (
    <Link href={link}>
      <div className="bg-default text-white p-6 rounded-lg shadow-sm flex flex-col justify-between min-h-[160px] hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
          <Icon
            className="w-10 h-10 group-hover:scale-110 transition-transform"
            strokeWidth={1.5}
          />
          <span className="text-4xl font-light">{count}</span>
        </div>
        <div className="text-sm font-bold tracking-wider mt-4">
          {label.toUpperCase()}
        </div>
      </div>
    </Link>
  );
}

const Dashboard = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        if (data.status === "success") {
          setCounts(data.counts);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardItems = [
    {
      text: "Model Pending Account",
      link: "/admin/model-account",
      icon: UserRound,
    },
    {
      text: "Model Active Account",
      link: "/admin/model-account/existing",
      icon: UserRound,
    },
    {
      text: "Model Profile",
      link: "/admin/model-profile",
      icon: UserRoundPen,
    },
    {
      text: "Model Media",
      link: "/admin/model-profile-media",
      icon: ImageIcon,
    },
    {
      text: "Model Measurement",
      link: "/admin/model-measurement",
      icon: Pencil,
    },
    {
      text: "Model Posts",
      link: "/admin/model-post",
      icon: FileText,
    },
    {
      text: "Timesheet",
      link: "/admin/timesheet",
      icon: Calendar,
    },
    {
      text: "Events",
      link: "/admin/events",
      icon: BellRing,
    },
  ];

  // Map items to counts
  const getCount = (text: string) => {
    switch (text) {
      case "Model Pending Account": return counts.modelPendingAccount || 0;
      case "Model Active Account": return counts.modelActiveAccount || 0;
      case "Model Profile": return counts.modelProfile || 0;
      case "Model Media": return counts.modelMedia || 0;
      case "Model Measurement": return counts.modelMeasurement || 0;
      case "Model Posts": return counts.modelPost || 0;
      case "Timesheet": return counts.timesheet || 0;
      case "Events": return counts.events || 0;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-default" />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl mb-8 font-normal">Pending Request</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-full">
        {dashboardItems.map((item, index) => (
          <RequestCard
            key={index}
            icon={item.icon}
            count={getCount(item.text)}
            label={item.text}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
