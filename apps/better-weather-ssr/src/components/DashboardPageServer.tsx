import React from "react";
import { WeatherParams, fetchForecastData } from "@/service/OpenMeteoService";
import { momentDateToString } from "@/utils/FormatDate";
import DashboardContainer from "./DashboardPageContainer";

const fetchInitData = async (
  beginDate: any,
  endDate: any,
  userLocation: any
) => {
  if (!beginDate || !endDate || !userLocation?.location) return null;
  try {
    return await fetchForecastData({
      start_date: momentDateToString(beginDate),
      end_date: momentDateToString(endDate),
      latitude: userLocation.location.latitude,
      longitude: userLocation.location.longitute,
      timezone: "auto",
      hourly: [
        WeatherParams.temperature_2m,
        WeatherParams.precipitation,
        WeatherParams.rain,
        WeatherParams.snowfall,
        WeatherParams.weather_code,
        WeatherParams.cloud_cover,
      ],
    });
  } catch (e) {
    console.error("Error fetching forecast data:", e);
    return null;
  }
};

export default async function DashboardPageServer({
  beginDate,
  endDate,
  userLocation,
}: {
  beginDate: any;
  endDate: any;
  userLocation: any;
}) {
  const data = await fetchInitData(beginDate, endDate, userLocation);

  if (!data) {
    return (
      <div className="min-h-full w-full h-full grid grid-cols-[100%_1fr] grid-rows-[100%_1fr]">
        No data available. Please try again.
      </div>
    );
  }

  return <DashboardContainer initData={data} />;
}
