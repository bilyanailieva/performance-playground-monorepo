"use client";
import { observer } from "mobx-react-lite";
import { Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";

import TableLegend from "@/components/TableLegend/TableLegend";
import LineChart from "@/components/TemperatureChart/LineChart";
import { generateComboChartData, generateDashboardData } from "@/utils/DataFormatters";
import CurrentWeatherCard from "@/components/CurrentWeatherCard/CurrentWeatherCard";
import { rootStoreContext } from "@/components/RootStoreProvider";
import CurrentWeatherCardServer from "@/components/CurrentWeatherCard/CurrentWeatherCardSSR";
import WeatherCardWrapper from "@/components/CurrentWeatherCard/CurrentWeatherCardHelper";
import { useCollectWebVitals } from "@/hooks/useWebReportVitals";

const DashboardContainer = observer(({initData}: {initData: any}) => {
  const rootStore = useContext(rootStoreContext);
  const isInitRender = useRef(true);
  if (!rootStore) {
    console.error("RootStore is not available.");
    return <div>Unable to load data. Please try again later.</div>;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [error, _setError] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if(isInitRender && initData.length) {
        setData(initData);
        rootStore.setApiData(initData)
        isInitRender.current = false;
    }
  }, []);
  useMemo(() => {
    
    if (data.length) {
      const { weatherData, tableData, colors } = generateDashboardData(
        data,
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
    data,
    rootStore.headerControls.viewMode
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div className="min-h-full w-full h-full grid grid-cols-[100%_1fr] grid-rows-[100%_1fr]">
       <div className="max-h-40 w-full h-full grid gap-4 grid-cols-3">
        <div
          id="card-left-full"
          className="h-full bg-white col-span-2 rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative p-3 overflow-hidden"
        >
          <Suspense fallback={<div>Loading Weather Data...</div>}>
            <TableLegend tableData={tableData} cityColors={colors} />
          </Suspense>
        </div>
        <div
          id="current-weather-card"
          className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
        <Suspense fallback={<div>Loading Weather Data...</div>}>
            {/* Use the async Server Component */}
          {WeatherCardWrapper({location: rootStore.selectedLocation})}
        </Suspense>
        </div>
        <div className="grid col-span-3 row-span-2">
          {/* <div className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative p-3"></div> */}
          <div
            id="card-bottom-right"
            className="overflow-hidden bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
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
    //  : <div className="min-h-full w-full h-full grid grid-cols-[100%_1fr] grid-rows-[100%_1fr]">...data loading</div>
  // ) : <div className="min-h-full w-full h-full grid grid-cols-[100%_1fr] grid-rows-[100%_1fr]">...loading</div>;
});

export default DashboardContainer;
