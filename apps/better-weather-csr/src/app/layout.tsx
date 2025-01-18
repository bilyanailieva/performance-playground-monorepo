"use client";
import { ControlHeader } from "@/components/ControlHeader";
import ControlHeaderSSR from "@/components/ControlHeaderSSR";
import Sidebar from "@/components/Sidebar";
import RootStore, { UserLocation } from "@/stores/RootStore";
import { usePathname } from "next/navigation";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { createContext, useEffect } from "react";
import "./globals.css";
import { getLocation } from "@/helper/LocationHelper";
import { useCollectWebVitals } from "./hooks/useWebReportVitals";
import { useReportWebVitals } from "next/web-vitals";

const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let userLocation = undefined;
        const cachedLocation = localStorage.getItem("location");
        console.log(cachedLocation);
        if (cachedLocation) {
          console.log(JSON.parse(cachedLocation));
          rootStore.setLocation(JSON.parse(cachedLocation));
          userLocation= JSON.parse(cachedLocation);
        } else {
          const location = await getLocation();
          console.log(location);
          if (location) {
            localStorage.setItem("location", JSON.stringify(location));
            rootStore.setLocation(location);
            userLocation = location;
          }
        }
        if(!userLocation) return;
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

    useReportWebVitals((metric: any) => {
    console.log(metric);
  });
  return (
    <html lang="en">
      <body>
        <rootStoreContext.Provider value={rootStore}>
          <div className="fixed flex flex-col top-0 left-0 h-screen w-screen">
              <ControlHeader />
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
