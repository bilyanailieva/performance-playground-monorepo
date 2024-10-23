"use client";
import { generateBarChartData } from "@/helper/BarChartHelper";
import RootStore from "@/stores/RootStore";
import { observer } from "mobx-react-lite";
import { Chart } from "primereact/chart";
import { useMemo, useState } from "react";

type BarChartProps = {
  apiData: any;
  cityColors: string[];
  timesteps: string[];
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
const BarChart = observer((props: { store: RootStore }) => {
  const [chartData, setChartData] = useState<any>([]);

  useMemo(() => {
    if (!props.store.presentationData) return;
    console.log(props.store.presentationData);
    const data = generateBarChartData(
      props.store.presentationData,
      props.store.chartColors
    );
    console.log(data);
    setChartData({ datasets: data.datasets, labels: props.store.timesteps });
  }, [props.store.presentationData]);

  return (
    <Chart
      type="bar"
      data={chartData}
      options={chartOptions}
      className="flex justify-center h-full w-full absolute top-0 left-0 right-0 ml-auto mr-auto"
    />
  );
});

export default BarChart;
