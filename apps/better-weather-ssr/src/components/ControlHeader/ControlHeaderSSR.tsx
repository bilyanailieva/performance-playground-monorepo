// src/components/ControlHeaderServer.tsx
import dynamic from "next/dynamic";
import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import moment from "moment";

// Dynamically import the client-side component
const ControlHeaderClient = dynamic(() => import("./ControlHeaderClient"), {
  ssr: false, // Disable SSR for the client component
});

// Fetch preloaded data
async function fetchPreloadedData() {
  const locations = europeanCapitals.features.map((feature: any) => ({
    name: feature.properties.capital,
    isoCode: feature.properties.iso_a3,
    latitude: feature.properties.latitude,
    longitude: feature.properties.longitude,
  }));

  const defaultInterval = "auto"; // Default interval
  const beginDate = moment().subtract(7, "days").toISOString(); // Example begin date
  const endDate = moment().toISOString(); // Example end date

  return {
    locations,
    defaultInterval,
    beginDate,
    endDate,
  };
}

// Server Component
export default async function ControlHeaderSSR() {
  const preloadedData = await fetchPreloadedData();

  return (
    <div className="min-h-[60px] w-full">
      {/* Pass preloaded data to the client component */}
      <ControlHeaderClient preloadedData={preloadedData} />
    </div>
  );
}


