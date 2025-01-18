"use client";

import { UserLocation } from "@/stores/RootStore";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { generateLineChartData } from "./TemperatureChartHelper";

type LineChartProps = {
  chartData: any;
  cityColors: string[];
  location?: UserLocation;
  field?: string;
  viewMode: "hourly" | "daily" | "monthly" | "auto";
};

export const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Chart.js Line Chart" },
  },
  maintainAspectRatio: false,
  normalized: true,
  spanGaps: true,
  animation: false
};

const LineChart = (props: LineChartProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!props.chartData || !props.cityColors.length) return;

    // Generate and set chart data
    const finalData = generateLineChartData(
      props.chartData,
      props.cityColors,
      props.location,
      props.field,
      props.viewMode
    );
    setChartData(finalData);
    setIsLoading(false);
  }, [props.chartData, props.cityColors, props.viewMode]);

  return (<>
  {isLoading ? (
    // Skeleton loader with reserved dimensions
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 min-h-[300px]">
      <p className="animate-pulse text-gray-400">Loading...</p>
    </div>
  ) : chartData?.datasets?.length ? (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[300px]">

    <div className="relative w-full h-full">
      <Chart
        className="w-full h-full"
        type="line"
        data={chartData}
        options={options}
      />
    </div>
    </div>
  ) : (
    // Fallback message with reserved dimensions
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
      <p className="text-center text-gray-500">No data available</p>
    </div>
  )}

</>
  );
};

export default LineChart;
