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
    if (!props.chartData) return;
    console.log(props.cityColors);
    const finalData = generateLineChartData(
      props.chartData,
      props.cityColors,
      props.location,
      props.field
    );
    setChartData(finalData);
  }, [props.chartData]);
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
