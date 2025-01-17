"use client";
import { observer } from "mobx-react-lite";
import { useContext, useMemo, useState } from "react";

import TableLegend from "@/components/TableLegend/TableLegend";
import LineChart from "@/components/TemperatureChart/LineChart";
import { generateComboChartData, generateDashboardData } from "@/utils/DataFormatters";
import { rootStoreContext } from "./../layout";
import CurrentWeatherCard from "@/components/CurrentWeatherCard/CurrentWeatherCard";

const DashboardContainer = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, _setError] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useMemo(() => {
    if (rootStore?.apiData?.length) {
      const { weatherData, tableData, colors } = generateDashboardData(
        rootStore.apiData,
        rootStore.openMeteoParams(),
        rootStore.headerControls.viewMode,
        rootStore.selectedLocation,
      );
      console.log(weatherData);
      if (!weatherData) {
        throw new Error("Network response was not ok");
      }
      setColors(colors);
      setChartData(weatherData);
      setTableData(tableData);
    } else {
      setColors([]);
      setChartData([]);
      setTableData([]);
    }
    setIsLoading(false);
  }, [
    rootStore.apiData,
    rootStore.headerControls.viewMode
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full grid grid-cols-[100%_1fr] grid-rows-[100%_1fr]">
      <div className="w-full h-full grid gap-4 grid-cols-3">
        <div
          id="card-left-full"
          className="bg-white col-span-2 rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative p-3 overflow-hidden"
        >
          <TableLegend tableData={tableData} cityColors={colors} />
        </div>
        <div
          id="current-weather-card"
          className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <CurrentWeatherCard />
        </div>
        <div className="grid col-span-3 row-span-2">
          {/* <div className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative p-3"></div> */}
          <div
            id="card-bottom-right"
            className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
          >
            <LineChart
              chartData={chartData}
              cityColors={colors}
              location={rootStore.selectedLocation}
              field="minMax"
              viewMode={rootStore.headerControls.viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardContainer;
