"use client";
import { observer } from "mobx-react-lite";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { generateCloudCoverageData } from "./CloudCoverageHelper";

export const CloudCoverageChart = observer(
  (props: { apiData: any; cityColors: string[] }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
      if (!props.apiData.length || !props.cityColors.length) {
        setChartData([]);
        setChartOptions([]);
        return;
      }
      const formattedData = generateCloudCoverageData(
        props.apiData,
        props.cityColors
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
    }, [props.apiData]);

    return (
      <Chart
        type="radar"
        data={chartData}
        options={chartOptions}
        className="flex justify-center h-full w-full absolute top-0 left-0 right-0 ml-auto mr-auto"
      />
    );
  }
);

export default CloudCoverageChart;
