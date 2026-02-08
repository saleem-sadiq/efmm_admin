"use client";
import Image from "next/image";
import { hamburger, logo } from "@/../public/assets";
import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { navigation } from "./constant";
import MyImage from "../shared/MyImage";

const Nav = () => {
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const path = usePathname();
  const toggleSubmenu = (index: number) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  // Handle logout
  const handleLogout = async () => {
    toast.info("Logging out...");

    // Clear cookies by setting expiry to the past
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // Use window.location.href to force a full page refresh and redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };


  return (
    <nav
      className={cn(
        "w-full xl:h-full xl:bg-blackfade2 mx-auto py-5 z-20 transition-colors duration-500 transition-timing-function-ease-in-out"
      )}
    >
      <div className="w-full flex flex-col mx-auto">
        <div className="w-full h-28 hidden xl:flex items-center justify-center">
          <Link href={"/"}>
            <MyImage src={logo.src} priority alt="logo" className="w-48 h-28" />
          </Link>
        </div>
        <div className="w-full mx-auto px-6 text-18 font-medium hidden xl:block overflow-y-auto max-h-[70vh]">
          <div className="w-full py-4 ">
            <ul className="w-full  flex flex-col gap-2 transition-all">
              {navigation.map((nav, i) => {
                const Icon = nav.icon;
                const isOpen = openSubmenu === i;

                // Enhanced isActive check to avoid prefix collision
                const isItemActive = (link: string) => {
                  if (link === "#") return false;
                  return path === link || path.startsWith(link + "/");
                };

                const isActive = isItemActive(nav.link) ||
                  (nav.submenu?.some(sub => isItemActive(sub.link)) ?? false);

                return (
                  <div key={i}>
                    {nav.submenu ? (
                      <li
                        className={`relative w-full transition-all duration-300 ease-in-out px-5 py-4 rounded-lg text-whitefade hover:rounded-xl hover:bg-default group flex flex-col cursor-pointer ${isActive ? "bg-default p-2" : ""
                          }`}
                        onClick={() => toggleSubmenu(i)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex items-center gap-3">
                            <Icon />
                            {nav.text}
                          </span>
                          <span className={cn("transition-transform duration-300", isOpen && "rotate-180")}>
                            <ChevronDown width={20} />
                          </span>
                        </div>

                        <div
                          className={cn(
                            "w-full overflow-hidden transition-all duration-300 ease-in-out",
                            isOpen ? "max-h-[500px] mt-4" : "max-h-0"
                          )}
                        >
                          <ul className="space-y-1">
                            {nav.submenu.map((submenu, index) => {
                              const isSubActive = path === submenu.link;
                              return (
                                <li
                                  key={index}
                                  className={cn(
                                    "p-3 rounded transition-all duration-300 ease-in-out hover:bg-blackfade2 text-sm",
                                    isSubActive ? "bg-blackfade text-white font-bold" : "text-whitefade"
                                  )}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Link href={submenu.link}>{submenu.text}</Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    ) : (
                      <li
                        className={`relative p-5 rounded-lg hover:rounded-xl hover:bg-default text-whitefade transition-all duration-300 ease-in-out ${isActive ? "bg-default !text-white" : ""
                          }`}
                      >
                        <Link href={nav.link} className="flex gap-2">
                          <span className="flex items-center gap-3">
                            <Icon />
                            {nav.text}
                          </span>
                        </Link>
                      </li>
                    )}
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
        <div
          onClick={handleLogout}
          className={cn(
            "w-[230px] cursor-pointer mx-auto hidden group jellyEffect overflow-hidden xl:flex justify-center items-center gap-4 text-[16px] font-semibold text-whitefade border-2 bordder-white px-6 py-3 mt-5 bg-default ease-in rounded-full relative"
          )}
        >
          <div className="absolute -left-[100%] w-full h-12 rounded-full opacity-35 bg-red-300 group-hover:translate-x-[100%]  transition-transform group-hover:duration-1000 duration-500"></div>
          <div className="absolute -left-[100%] w-full h-12 rounded-full opacity-25 bg-red-400 group-hover:translate-x-[100%]  transition-transform group-hover:duration-700 duration-700"></div>
          <div className="absolute -left-[100%] w-full h-12 rounded-full opacity-15 bg-red-500 group-hover:translate-x-[100%]  transition-transform group-hover:duration-500 duration-1000"></div>
          <div className="relative z-10 flex items-center justify-center gap-4">
            <LogOut />
            {`Logout`}
          </div>
        </div>
      </div>
      <Sheet key={path}>
        <SheetTrigger className="bg-default rounded-xl relative w-10 h-10 p-1 m-3 group xl:hidden">
          <MyImage
            className="p-1 text-white stroke-black-100 fill-black-100"
            src={hamburger.src}
            alt={"hamburger icon"}
          />
        </SheetTrigger>
        <SheetContent
          className="bg-blackfade2 text-default100 px-0 py-10 outline-none border-none"
          side={"left"}
        >
          <SheetHeader>
            <SheetTitle>
              <div className="w-full h-28 xl:hidden flex items-center justify-center">
                <Link href={"/"}>
                  <MyImage src={logo.src} alt="logo" className="w-48 h-28" />
                </Link>
              </div>
            </SheetTitle>
            <SheetDescription>
              <div
                className="w-full py-4 px-2 overflow-y-scroll max-h-[80vh]" // Added max-height and overflow-y-scroll here
              >
                <ul className="w-full flex flex-col gap-2">
                  {navigation.map((nav, i) => {
                    const Icon = nav.icon;
                    const isOpen = openSubmenu === i;

                    const isItemActive = (link: string) => {
                      if (link === "#") return false;
                      return path === link || path.startsWith(link + "/");
                    };

                    const isActive = isItemActive(nav.link) ||
                      (nav.submenu?.some(sub => isItemActive(sub.link)) ?? false);

                    return (
                      <div key={i}>
                        {nav.submenu ? (
                          <li
                            className={`relative w-full duration-300 px-5 py-4 rounded-xl text-whitefade hover:bg-default group flex flex-col cursor-pointer ${isActive ? "bg-default" : ""
                              }`}
                            onClick={() => toggleSubmenu(i)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="flex items-center gap-3">
                                <Icon />
                                {nav.text}
                              </span>
                              <ChevronDown className={cn("transition-transform duration-300", isOpen && "rotate-180")} width={20} />
                            </div>

                            <div
                              className={cn(
                                "w-full overflow-hidden transition-all duration-300 ease-in-out",
                                isOpen ? "max-h-[500px] mt-4" : "max-h-0"
                              )}
                            >
                              <ul className="space-y-1">
                                {nav.submenu.map((submenu, index) => {
                                  const isSubActive = path === submenu.link;
                                  return (
                                    <li
                                      key={index}
                                      className={cn(
                                        "p-4 rounded text-left transition-all duration-300",
                                        isSubActive ? "bg-blackfade text-white font-bold" : "text-whitefade"
                                      )}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Link href={submenu.link}>
                                        {submenu.text}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </li>
                        ) : (
                          <li
                            className={`relative p-5 rounded-xl hover:bg-default text-whitefade ${isActive ? "bg-default !text-white" : ""
                              }`}
                          >
                            <Link href={nav.link} className="flex gap-2">
                              <span className="flex items-center gap-3">
                                <Icon />
                                {nav.text}
                              </span>
                            </Link>
                          </li>
                        )}
                      </div>
                    );
                  })}
                </ul>
                <div
                  onClick={handleLogout}
                  className={cn(
                    "w-[90%] cursor-pointer m-6 xl:hidden mx-auto group jellyEffect overflow-hidden flex justify-center items-center gap-4 text-[16px] font-semibold text-whitefade border-2 bordder-white px-6 py-3 bg-default ease-in rounded-full relative"
                  )}
                >
                  <div className="absolute -left-[100%] w-full h-12 rounded-full opacity-35 bg-red-300 group-hover:translate-x-[100%]  transition-transform group-hover:duration-1000 duration-500"></div>
                  <div className="absolute -left-[100%] w-full h-12 rounded-full opacity-25 bg-red-400 group-hover:translate-x-[100%]  transition-transform group-hover:duration-700 duration-700"></div>
                  <div className="absolute -left-[100%] w-full h-12 rounded-full opacity-15 bg-red-500 group-hover:translate-x-[100%]  transition-transform group-hover:duration-500 duration-1000"></div>
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    <LogOut />
                    {`Logout`}
                  </div>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Nav;
