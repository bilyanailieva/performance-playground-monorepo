"use client";

import RootStore from "@/stores/RootStore";
import { observer } from "mobx-react-lite";
import { Chart } from "primereact/chart";
import { useMemo } from "react";
import { generateLineChartData } from "./TemperatureChartHelper";

type LineChartProps = {
  store: RootStore;
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
  maintainAspectRatio: false,
  normalized: true,
  spanGaps: true,
};

const LineChart = observer((props: LineChartProps) => {
  const { store, field } = props;

  // Memoize the chart data to avoid unnecessary recalculations
  const chartData = useMemo(() => {
    if (!store.presentationData) return { datasets: [], labels: [] };

    const finalData = generateLineChartData(
      store.presentationData,
      store.chartColors,
      store.selectedLocation,
      field
    );

    return {
      datasets: finalData.datasets,
      labels: store.timesteps,
    };
  }, [
    store.presentationData,
    store.chartColors,
    store.selectedLocation,
    field,
  ]);

  return (
    <Chart
      className="w-full h-full relative flex-grow"
      type="line"
      data={chartData}
      options={options}
    />
  );
});

export default LineChart;
