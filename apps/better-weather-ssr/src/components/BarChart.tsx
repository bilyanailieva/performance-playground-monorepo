"use client";
import { generateBarChartData } from "@/helper/ComboChartContainerHelper";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

type BarChartProps = {
  apiData: any;
  cityColors: string[];
  viewMode: 'hourly' | 'daily' | 'monthly' | 'auto'
};

const chartOptions = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      labels: {
        fontColor: "black",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "black",
        font: {
          weight: 500,
        },
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      ticks: {
        color: "black",
      },
      grid: {
        color: "black",
        drawBorder: false,
      },
    },
  },
};
const BarChart: React.FC<BarChartProps> = (props: BarChartProps) => {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    if (!props.apiData) return;
    console.log(props.apiData);
    const data = generateBarChartData(props.apiData, props.cityColors);
    console.log(data);
    setChartData(data);
  }, [props.apiData]);

  return chartData?.datasets?.length ? (
    <Chart
      type="bar"
      data={chartData}
      options={chartOptions}
      className="flex justify-center h-full w-full absolute top-0 left-0 right-0 ml-auto mr-auto"
    />
  ) : (
    <></>
  );
};

export default BarChart;
