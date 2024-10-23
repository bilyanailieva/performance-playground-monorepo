"use client";
import RootStore from "@/stores/RootStore";
import { observer } from "mobx-react-lite";
import { Chart } from "primereact/chart";
import { useMemo, useState } from "react";
import { generateCloudCoverageData } from "./CloudCoverageHelper";

export const CloudCoverageChart = observer((props: { store: RootStore }) => {
  const [chartData, setChartData] = useState<{
    datasets: any[];
    labels: any[];
  }>({ datasets: [], labels: [] });
  const [chartOptions, setChartOptions] = useState({});

  useMemo(() => {
    const formattedData = generateCloudCoverageData(
      props.store.presentationData,
      props.store.chartColors
    );

    const data = {
      labels: ["Morning", "Afternoon", "Evening", "Nightime"],
      datasets: formattedData,
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            color: "black",
          },
          fullSize: true,
          maxWidth: 1000,
        },
      },
      scales: {
        r: {
          grid: {
            color: "black",
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [props.store.presentationData]);

  return (
    <Chart
      type="radar"
      data={chartData}
      options={chartOptions}
      className="flex justify-center h-full w-full absolute top-0 left-0 right-0 ml-auto mr-auto"
    />
  );
});

export default CloudCoverageChart;
