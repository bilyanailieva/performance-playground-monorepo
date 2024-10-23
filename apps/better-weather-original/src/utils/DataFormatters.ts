import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { UserLocation } from "@/stores/RootStore";
import { calculateMean } from "./ChartHelpers";
import { generateColors } from "./ColorGenerator";

export const generateComboChartData = (
  apiData: any[],
  queryParams: any,
  userLocation?: UserLocation
) => {
  let chartData: any = [];
  let tableData: any[] = [];
  let colors: string[] = [];

  console.log("here", apiData);
  if (!apiData.length) return { weatherData: chartData, tableData, colors };
  colors = generateColors(queryParams.longitude);

  const data: any[] = [];
  apiData.forEach((response: any, index: number) => {
    const timezone = response.cityInfo.timezone;
    const intervalEntries = response.values;

    const weatherData: any = {
      timeRange: {
        beginDate: queryParams.start_date,
        endDate: queryParams.end_date,
      },
      coords: {
        latitude: queryParams.latitude[index],
        longitude: queryParams.longitude[index],
      },
      time: [],
      temperature2m: [],
      rain: [],
      cloudCover: [],
    };

    const city: any = europeanCapitals.features.find(
      (feature) =>
        feature.properties.latitude?.toFixed(2) ===
          weatherData.coords.latitude.toFixed(2) &&
        feature.properties.longitude?.toFixed(2) ===
          weatherData.coords.longitude.toFixed(2)
    );

    const tableEntry: any = {
      id: city?.properties?.iso_a3 ?? userLocation?.id,
      cityName: city?.properties?.capital ?? userLocation?.name,
      avgTemp: 0,
      presipitationSum: 0,
      minTemp: 0,
      maxTemp: 0,
      cloudCover: 0,
      color: colors[index],
    };

    intervalEntries.forEach((entry: any, key: any) => {
      weatherData.time.push(entry.timestamp);
      weatherData.temperature2m.push(entry.temperature_2m);
      weatherData.rain.push(entry.rain);
      weatherData.cloudCover.push(entry.cloudCover);
    });

    tableEntry.avgTemp = calculateMean(weatherData.temperature2m);
    tableEntry.presipitationSum = weatherData.rain.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      0
    );
    tableEntry.minTemp = Math.min(...weatherData.temperature2m);
    tableEntry.maxTemp = Math.max(...weatherData.temperature2m);
    chartData.push(weatherData);
    tableData.push(tableEntry);
  });
  return { weatherData: chartData, tableData, colors };
};
