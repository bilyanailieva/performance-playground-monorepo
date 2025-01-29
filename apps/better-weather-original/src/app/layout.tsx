"use client";
import ControlHeaderSSR from "@/components/ControlHeaderSSR";
import RootStore from "@/stores/RootStore";
import { usePathname } from "next/navigation";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { createContext } from "react";
import "./globals.css";
import ControlHeader from "@/components/ControlHeader";
import Sidebar from "@/components/Sidebar";


const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  return (
    <html lang="en">
      <body>
        <rootStoreContext.Provider value={rootStore}>
          <div className="fixed flex flex-col top-0 left-0 h-screen w-screen">
            {pathName.includes("combo-chart-ssr") ? (
              <ControlHeaderSSR />
            ) : (
              <ControlHeader />
            )}

            <div className="flex w-full h-full items-center flex-grow p-5">
              <Sidebar />
              <div className="divider divider-horizontal"></div>
              <div className="w-full h-full relative">{children}</div>
            </div>
          </div>
        </rootStoreContext.Provider>
      </body>
    </html>
  );
}
