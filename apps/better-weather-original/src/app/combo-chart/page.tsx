"use client";
const BarChart = dynamic(() => import("@/components/BarChart"), { ssr: false });
const LineChart = dynamic(
  () => import("@/components/TemperatureChart/LineChart"),
  { ssr: false }
);
const CloudCoverageChart = dynamic(
  () => import("@/components/CloudCoverageChart/CloudCoverageChart"),
  { ssr: false }
);
const TableLegend = dynamic(
  () => import("@/components/TableLegend/TableLegend"),
  { ssr: false }
);
import { generateComboChartData } from "@/utils/DataFormatters";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { Profiler, useContext, useEffect, useState } from "react";
import {
  WeatherParams,
  fetchHistoricalDataForMultipleCities,
} from "../../service/OpenMeteoService";
import { rootStoreContext } from "../layout";
const ComboChartPage = observer(() => {
  const rootStore = useContext(rootStoreContext);
  // const { selectedLocation, headerControls } = rootStore;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const params = {
      latitude: rootStore.latutudes,
      longitude: rootStore.longitudes,
      start_date: rootStore.headerControls?.beginDate,
      end_date: rootStore.headerControls?.endDate,
      hourly: [
        WeatherParams.temperature_2m,
        WeatherParams.precipitation,
        WeatherParams.rain,
        WeatherParams.snowfall,
        WeatherParams.weather_code,
        WeatherParams.cloud_cover,
      ],
      daily: [
        WeatherParams.temperature_2m_mean,
        WeatherParams.precipitation_sum,
      ],
      timezone: "auto",
    };
    const fetchData = async () => {
      const start = performance.now();
      try {
        if (
          rootStore.selectedCitiesInfo.length &&
          rootStore.headerControls?.beginDate &&
          rootStore.headerControls.endDate
        ) {
          const apiData = await fetchHistoricalDataForMultipleCities(params);
          const { weatherData, tableData, colors } = generateComboChartData(
            apiData,
            params
          );
          console.log(tableData);
          if (!weatherData) {
            throw new Error("Network response was not ok");
          }
          setColors(colors);
          setChartData(weatherData);
          setTableData(tableData);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
        const end = performance.now();
        console.log(`Data fetching took ${end - start} ms`);
      }
    };
    if (
      rootStore.selectedCitiesInfo.length &&
      rootStore.headerControls?.beginDate &&
      rootStore.headerControls.endDate
    ) {
      console.log("here");
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [
    rootStore.activeTab,
    rootStore.selectedCitiesInfo,
    rootStore.headerControls?.beginDate,
    rootStore.headerControls?.endDate,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleTableUpdate = (selection: any[]) => {
    console.log("selection", selection);
  };

  return (
    <Profiler id="ComboChartPageCLIENTPage" onRender={() => console.log('I rendered')}>
    <div className="w-full h-full grid gap-4 grid-cols-[50%_1fr] grid-rows-[100%_1fr]">
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="card-left-full"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3 overflow-hidden"
        >
          <TableLegend
            tableData={tableData}
            cityColors={colors}
            // onSelectionChange={handleTableUpdate}
          />
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <CloudCoverageChart apiData={chartData} cityColors={colors} />
        </div>
      </div>
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="current-weather-card"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <LineChart chartData={chartData} cityColors={colors} />
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <BarChart apiData={chartData} cityColors={colors} />
        </div>
      </div>
    </div>
    </Profiler>
  );
});

export default ComboChartPage;
