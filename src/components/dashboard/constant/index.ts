import {
  BellRing,
  Calendar,
  CalendarClock,
  Cast,
  ChartLine,
  FileText,
  Handshake,
  ImageIcon,
  LayoutDashboardIcon,
  Link2,
  Pencil,
  UserRound,
  UserRoundPen,
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
    link: "/admin/model-profile",
    text: "Model Profile",
    icon: UserRoundPen,
  },
  {
    link: "/admin/model-profile-media",
    text: "Model Media",
    icon: ImageIcon,
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