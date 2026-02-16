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
    link: "#",
    text: "Model Account",
    icon: UserRound,
    submenu: [
      { link: "/admin/model-account", text: "New Account Request" },
      { link: "/admin/model-account/existing", text: "Existing Account" },
    ],
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
    link: "/admin/model-measurement",
    text: "Model Measurement",
    icon: Pencil,
  },
  {
    link: "/admin/model-post",
    text: "Model Posts",
    icon: FileText,
  },
  {
    link: "/admin/timesheet",
    text: "Timesheet",
    icon: Calendar,
  },
  {
    link: "/admin/model-inquiry",
    text: "Model Inquiries",
    icon: UserRound,
  },
  {
    link: "#",
    text: "Events",
    icon: BellRing,
    submenu: [
      { link: "/admin/events", text: "Manage Events" },
      { link: "/admin/events/manage-models", text: "Manage Models" },
    ],
  }
];

export { navigation };