import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { logo } from "../../../public/assets";
import MyImage from "@/components/shared/MyImage";
import Nav from "@/components/dashboard/Nav";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EFMM Dashboard",
  description: "Model Portal Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} bg-blackfade`} suppressHydrationWarning>
        <div className="w-full h-screen grid grid-cols-12 overflow-hidden">
          {/* --- Sidebar Section --- */}
          <div className="col-span-12 xl:col-span-3 flex items-center xl:block bg-blackfade2">
            <div className="h-full xl:overflow-y-hidden">
              <Nav />
            </div>
            {/* --- Mobile Header Logo --- */}
            <div className="xl:hidden flex justify-center w-full py-4">
              <MyImage
                src={logo.src}
                alt="EFMM logo"
                width={1000}
                height={1000}
                className="w-28 h-28 object-contain"
              />
            </div>
          </div>

          {/* --- Main Content Area --- */}
          <div className="col-span-12 xl:col-span-9 h-screen overflow-y-auto bg-blackfade text-white">
            {children}
          </div>

          <Toaster richColors />
        </div>
      </body>
    </html>
  );
}