// src/app/layout.tsx
import ControlHeaderServer from "@/components/ControlHeader/ControlHeaderSSR";
import RootStoreProvider from "@/components/RootStoreProvider";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "./globals.css";
import RootStore from "@/stores/RootStore";
import { getLocation } from "@/helper/LocationHelper";
import { useCollectWebVitals } from "@/hooks/useWebReportVitals";
import dynamic from "next/dynamic";
import ControlHeaderClient from "@/components/ControlHeader/ControlHeaderClient";
const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false });

export function reportWebVitals(metric: any) {
  console.log(metric); // Log metrics to the console

  // Example: Send metrics to an analytics service
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metric),
  });
}

async function fetchUserLocation() {
  try {
    // Use IP-based geolocation to fetch user location
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to fetch server-side location");
    }

    const locationData = await response.json();

    // Process and return the user location
    return {
      name: locationData.city || "Unknown City",
      id: locationData.postal || "Unknown ID",
      country: locationData.country_name || "Unknown Country",
      location: {
        latitude: locationData.latitude,
        longitute: locationData.longitude,
        timezone: locationData.timezone,
      },
    };
  } catch (error) {
    console.error("Error fetching location server-side:", error);

    // Fallback to default location
    return {
      name: "Default City",
      id: -1,
      country: "Default Country",
      location: {
        latitude: 40.7128, // Default latitude (e.g., New York City)
        longitute: -74.006, // Default longitude
        timezone: "America/New_York", // Default timezone
      },
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userLocation = await fetchUserLocation(); // Fetch the user location server-side
  
  return (
    <html lang="en">
      <body>
        {/* Wrap the layout in the RootStoreProvider */}
        <RootStoreProvider userLocation={userLocation}>
          <div className="fixed flex flex-col top-0 left-0 h-screen w-screen">
            {/* Use the Server Component */}
            <ControlHeaderClient  />
            <div className="flex w-full h-full items-center flex-grow p-5">
              <Sidebar />
              <div className="divider divider-horizontal"></div>
              <div className="w-full h-full relative">{children}</div>
            </div>
          </div>
        </RootStoreProvider>
      </body>
    </html>
  );
}
