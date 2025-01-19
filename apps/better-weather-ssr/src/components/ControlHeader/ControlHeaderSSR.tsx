// src/components/ControlHeaderServer.tsx
import dynamic from "next/dynamic";
import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import moment from "moment";
import { WeatherParams, fetchForecastData } from "@/service/OpenMeteoService";
import { momentDateToString } from "@/utils/FormatDate";

// Dynamically import the client-side component
const ControlHeaderClient = dynamic(() => import("./ControlHeaderClient"), {
  ssr: false, // Disable SSR for the client component
});

// Fetch preloaded data
async function fetchPreloadedData(userLocation: any) {

  const defaultInterval = "auto"; // Default interval
  const beginDate = moment().subtract(7, "days"); // Example begin date
  const endDate = moment(); // Example end date
// let data = [];

  // try {
  //   data = await fetchForecastData({
  //     start_date: momentDateToString(beginDate),
  //     end_date: momentDateToString(endDate),
  //     latitude: userLocation.location.latitude,
  //     longitude: userLocation.location.longitute,
  //     timezone: "auto",
  //     hourly: [
  //       WeatherParams.temperature_2m,
  //       WeatherParams.precipitation,
  //       WeatherParams.rain,
  //       WeatherParams.snowfall,
  //       WeatherParams.weather_code,
  //       WeatherParams.cloud_cover,
  //     ],
  //   });
  // } catch (e) {
  //   console.error("Error!", e);
  // }

  return {
    preloadedData: {
    defaultInterval,
    beginDate: beginDate.toISOString(),
    endDate: endDate.toISOString(),
  }};
}

// Server Component
export default function ControlHeaderSSR(userLocation?: any) {
  try {
    // const { preloadedData } = await fetchPreloadedData(userLocation);

    return (
      <div className="min-h-[130px] w-full">
        {/* Pass preloaded data to the client component */}
        <ControlHeaderClient  />
      </div>
    );
  } catch (error) {
    console.error("Error in ControlHeaderSSR:", error);

    // Render fallback UI
    return (
      <div className="min-h-[130px] w-full">
        <ControlHeaderClient  />
      </div>
    );
  }
}


