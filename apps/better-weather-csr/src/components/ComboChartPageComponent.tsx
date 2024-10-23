import { generateComboChartData } from "@/utils/DataFormatters";
import axios from "axios";

import dynamic from "next/dynamic";
const TableLegend = dynamic(
  () => import("@/components/TableLegend/TableLegend"),
  { ssr: false }
);
const BarChart = dynamic(() => import("@/components/BarChart"), { ssr: false });
const LineChart = dynamic(
  () => import("@/components/TemperatureChart/LineChart"),
  { ssr: false }
);
const CloudCoverageChart = dynamic(
  () => import("@/components/CloudCoverageChart/CloudCoverageChart"),
  { ssr: false }
);
enum WeatherParamsServer {
  "temperature_2m" = "temperature_2m",
  "precipitation" = "precipitation",
  "rain" = "rain",
  "snowfall" = "snowfall",
  "weather_code" = "weather_code",
  "temperature_2m_mean" = "temperature_2m_mean",
  "apparent_temperature" = "apparent_temperature",
  "precipitation_sum" = "precipitation_sum",
  "cloud_cover" = "cloud_cover",
}

// Utility function to extract and format query parameters
const getParamsFromQuery = (query: any) => {
  console.log("12", query.latitude);
  const latitude = query?.latitude ? JSON.parse(query.latitude) : [];
  const longitude = query?.longitude ? JSON.parse(query.longitude) : [];
  const beginDate = query?.beginDate as string;
  const endDate = query?.endDate as string;

  return {
    latitude,
    longitude,
    start_date: beginDate,
    end_date: endDate,
    hourly: [
      WeatherParamsServer.temperature_2m,
      WeatherParamsServer.precipitation,
      WeatherParamsServer.rain,
      WeatherParamsServer.snowfall,
      WeatherParamsServer.weather_code,
      WeatherParamsServer.cloud_cover,
    ],
    daily: [
      WeatherParamsServer.temperature_2m_mean,
      WeatherParamsServer.precipitation_sum,
    ],
    timezone: "auto",
  };
};

export const fetchHistoricalData = async (params: any) => {
  const responses = await axios.get("http://localhost:8080/history", {
    params: params,
    paramsSerializer: (params) => {
      // Custom serializer to correctly handle array parameters
      const qs = Object.keys(params)
        .map((key) => {
          const value = params[key];
          return Array.isArray(value)
            ? value.map((val) => `${key}=${val}`).join("&")
            : `${key}=${value}`;
        })
        .join("&");
      return qs;
    },
  });
  return responses?.data;
};

// Fetch data based on parameters
const fetchData = async (query: any) => {
  const params = getParamsFromQuery(query);
  console.log("45", params);
  try {
    const apiData = await fetchHistoricalData(params);
    const { weatherData, tableData, colors } = generateComboChartData(
      apiData,
      params
    );
    return {
      chartData: weatherData,
      tableData: tableData,
      colors: colors,
      error: null,
    };
  } catch (error: any) {
    return {
      chartData: {},
      tableData: [],
      colors: [],
      error: { message: error.message },
    };
  }
};

// Server component to render the page
const ComboChartPageComponent: any = async ({ searchParams }: any) => {
  const data = await fetchData(searchParams);

  console.log("82", data);
  // if (data.error) {
  //   return <div>Error: {data.error.message}</div>;
  // }

  return (
    <div className="w-full h-full grid gap-4 grid-cols-[50%_1fr] grid-rows-[100%_1fr]">
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="card-left-full"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3 overflow-hidden"
        >
          <TableLegend
            tableData={data.tableData}
            cityColors={data.colors}
            // onSelectionChange={(selection) =>
            //   console.log("selection", selection)
            // }
          />
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <CloudCoverageChart
            apiData={data.chartData}
            cityColors={data.colors}
          />
        </div>
      </div>
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="current-weather-card"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <LineChart chartData={data.chartData} cityColors={data.colors} />
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <BarChart apiData={data.chartData} cityColors={data.colors} />
        </div>
      </div>
    </div>
  );
};

export default ComboChartPageComponent;
