"use client";

import { rootStoreContext } from "@/components/RootStoreProvider";
import { WeatherParams } from "@/service/OpenMeteoService";
import { Profiler, useContext } from "react";

export default function ComboChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const onRenderCallback = (
    id: string, // the "id" prop of the Profiler tree that has just committed
    phase: "mount" | "update" | "nested-update", // either "mount" (for the initial mount) or "update" (for re-renders)
    actualDuration: number, // time spent rendering the committed update
    baseDuration: number, // estimated time to render the entire subtree without memoization
    startTime: number, // when React began rendering this update
    commitTime: number // when React committed this update
  ) => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    });
  };
  const rootStore = useContext(rootStoreContext);
  if (!rootStore) {
    console.error("RootStore is not available.");
    return <div>Unable to load data. Please try again later.</div>;
  }
  const params = {
    latitude: rootStore.latutudes || [], // Ensure you set the correct latitude/longitude
    longitude: rootStore.longitudes || [],
    start_date: rootStore.headerControls?.beginDate,
    end_date: rootStore.headerControls?.endDate,
    hourly: [
      WeatherParams.temperature_2m,
      WeatherParams.precipitation,
      WeatherParams.rain,
      WeatherParams.snowfall,
      WeatherParams.weather_code,
      WeatherParams.cloud_cover,
    ],
    daily: [WeatherParams.temperature_2m_mean, WeatherParams.precipitation_sum],
    timezone: "auto",
  };

  return (
    <div className="absolute w-full bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] h-full p-3">
      <Profiler id="ComboChartPage" onRender={onRenderCallback}>
        {children}
      </Profiler>
    </div>
  );
}
