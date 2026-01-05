import {
  BellRing,
  Calendar,
  CalendarClock,
  Cast,
  ChartLine,
  FileText,
  Handshake,
  LayoutDashboardIcon,
  Link2,
  Pencil,
  UserRound,
  UsersRound,
} from "lucide-react";

type NavigationItem = {
  link: string;
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  submenu?: { link: string; text: string }[];
};

const navigation: NavigationItem[] = [
  {
    link: "/admin/dashboard",
    text: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    link: "/admin/model-account",
    text: "Model Account",
    icon: UserRound,
  },
  {
    link: "/admin/timesheet",
    text: "Timesheet",
    icon: Calendar,
  },
  {
    link: "/admin/events",
    text: "Events",
    icon: BellRing,
  }
];

export { navigation };