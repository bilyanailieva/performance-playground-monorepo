import ComboChartPageComponent from "@/components/ComboChartPageComponent";
import {
  WeatherParams,
  fetchHistoricalDataForMultipleCities,
} from "@/service/OpenMeteoService";

// Utility function to extract and format query parameters
const getParamsFromQuery = (query: any) => {
  console.log(query);
  const latitude = query?.latutude
    ? query?.latitude.toString().split(",").map(Number)
    : [];
  const longitude = query?.longitude
    ? query?.longitude.toString().split(",").map(Number)
    : [];
  const beginDate = query?.beginDate as string;
  const endDate = query?.endDate as string;

  return {
    latitude,
    longitude,
    start_date: beginDate,
    end_date: endDate,
    hourly: [
      WeatherParams.temperature_2m,
      WeatherParams.precipitation,
      WeatherParams.rain,
      WeatherParams.snowfall,
      WeatherParams.weather_code,
      WeatherParams.cloud_cover,
    ],
    daily: [WeatherParams.temperature_2m_mean, WeatherParams.precipitation_sum],
    timezone: "auto",
  };
};

// Function to fetch data (should be an async function)
const fetchData = async (query: any) => {
  const params = getParamsFromQuery(query);
  console.log(params);
  try {
    const apiData = await fetchHistoricalDataForMultipleCities(params);
    return {
      chartData: apiData.weatherData,
      tableData: apiData.tableData,
      colors: apiData.colors,
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

// Server component
const ComboChartServerComponent: any = async ({ searchParams }: any) => {
  console.log(searchParams);
  const data = await fetchData(searchParams);

  return (
    <ComboChartPageComponent
      chartData={data.chartData}
      tableData={data.tableData}
      colors={data.colors}
      error={data.error}
    />
  );
};

export default ComboChartServerComponent;
