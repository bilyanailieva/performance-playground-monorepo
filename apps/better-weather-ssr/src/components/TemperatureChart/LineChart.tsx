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
};

const LineChart = (props: LineChartProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, [props.chartData, props.cityColors, props.viewMode]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[300px]">
      {!isLoaded ? (
        // Skeleton loader prevents layout shift
        <div className="w-full h-full bg-gray-200 animate-pulse min-h-[300px]" />
      ) : chartData?.datasets?.length ? (
        <div className="w-full h-full flex-grow">
          <Chart
            className="w-full h-full flex-grow"
            type="line"
            data={chartData}
            options={options}
            style={{ height: "100%", width: "100%" }} // Ensures full height
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default LineChart;
