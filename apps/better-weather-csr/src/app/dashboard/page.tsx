"use client";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";

import TableLegend from "@/components/TableLegend/TableLegend";
import LineChart from "@/components/TemperatureChart/LineChart";
import { getLocation } from "@/helper/LocationHelper";
import { generateComboChartData } from "@/utils/DataFormatters";
import moment from "moment";
import {
  WeatherParams,
  fetchForecastData,
  fetchHistoricalDataForMultipleCities,
  getForecastDataParams,
} from "../../service/OpenMeteoService";
import { rootStoreContext } from "./../layout";
import CurrentWeatherCard from "@/components/CurrentWeatherCard/CurrentWeatherCard";
import { momentDateToString } from "@/utils/FormatDate";

const DashboardContainer = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const { selectedLocation, headerControls } = rootStore;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let userLocation = undefined;
        const cachedLocation = localStorage.getItem("location");
        if (cachedLocation) {
          console.log(JSON.parse(cachedLocation));
          rootStore.setLocation(JSON.parse(cachedLocation));
          userLocation= JSON.parse(cachedLocation);
        } else {
          const location = await getLocation();
          if (location) {
            localStorage.setItem("location", JSON.stringify(location));
            rootStore.setLocation(location);
            userLocation = location;
          }
        }
        if(!userLocation) return;
        const data = await fetchForecastData({
          start_date: momentDateToString(rootStore.headerControls.beginDate),
          end_date: momentDateToString(rootStore.headerControls.endDate),
          latitude: [userLocation?.location?.latitude],
          longitude: [userLocation?.location?.latitude],
          timezone: rootStore.selectedLocation?.location?.timezone ?? 'auto',
          hourly: [
            WeatherParams.temperature_2m,
            WeatherParams.precipitation,
            WeatherParams.rain,
            WeatherParams.snowfall,
            WeatherParams.weather_code,
            WeatherParams.cloud_cover,
          ]
        });
        rootStore.setApiData(data);
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (rootStore?.apiData?.length) {
      const { weatherData, tableData, colors } = generateComboChartData(
        rootStore.apiData,
        rootStore.openMeteoParams(),
        rootStore.selectedLocation
      );
      console.log(tableData);
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
  }, [
    rootStore.apiData
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
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardContainer;
