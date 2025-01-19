"use client";

import { useCollectWebVitals } from "@/hooks/useWebReportVitals";
import { WeatherParams, fetchForecastData } from "@/service/OpenMeteoService";
import { momentDateToString } from "@/utils/FormatDate";
import { useReportWebVitals } from "next/web-vitals";
import { Profiler } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="absolute min-h-full w-full bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] h-full p-3">
        {children}
      </div>
  );
}