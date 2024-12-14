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
  viewMode: 'hourly' | 'daily' | 'monthly' | 'auto'
};

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
  // layout: {
  //   autoPadding: true,
  // },
  maintainAspectRatio: false,
  normalized: true,
  spanGaps: true,
};

const LineChart = (props: LineChartProps) => {
  const [chartData, setChartData] = useState<any>([]);
  useEffect(() => {
    if (!props.chartData || !props.cityColors.length) return;
    console.log(props.cityColors);
    const finalData = generateLineChartData(
      props.chartData,
      props.cityColors,
      props.location,
      props.field,
      props.viewMode
    );
    setChartData(finalData);
  }, [props.chartData, props.viewMode]);
  return chartData?.datasets?.length ? (
    <Chart
      className="w-full h-full relative flex-grow"
      type="line"
      data={chartData}
      options={options}
    />
  ) : (
    <></>
  );
};

export default LineChart;
