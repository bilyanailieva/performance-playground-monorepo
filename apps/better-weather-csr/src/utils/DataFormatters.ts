import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { PresentationData } from "@/models/PresentationData";
import { TableDataEntry } from "@/models/TableData";
import { UserLocation } from "@/stores/RootStore";
import moment, { Moment } from "moment";
import { calculateMean, chooseInterval } from "./ChartHelpers";
import { generateColors } from "./ColorGenerator";
import { getTimestepsByTimeRange } from "./WeatherInfoHelpers";

export const generateComboChartData = (
  apiData: any[],
  queryParams: any,
  userLocation?: UserLocation
) => {
  let chartData: PresentationData[] = [];
  let tableData: TableDataEntry[] = [];
  let colors: string[] = [];

  console.log("here", apiData);
  if (!apiData.length)
    return { weatherData: chartData, tableData, colors, timesteps: [] };
  colors = generateColors(queryParams.longitude);

  const data: any[] = [];
  const { interval, format } = chooseInterval({
    beginDate: queryParams.start_date,
    endDate: queryParams.end_date,
  });
  const timesteps = getTimestepsByTimeRange(
    {
      beginDate: queryParams.start_date,
      endDate: queryParams.end_date,
    },
    interval
  );
  apiData.forEach((response: any, index: number) => {
    const intervalEntries = response.values;

    const weatherData: PresentationData = {
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
      entryData: {},
      city: {},
    };

    weatherData.city = europeanCapitals.features.find(
      (feature) =>
        feature.properties.latitude?.toFixed(2) ===
          weatherData.coords.latitude.toFixed(2) &&
        feature.properties.longitude?.toFixed(2) ===
          weatherData.coords.longitude.toFixed(2)
    );

    const tableEntry: TableDataEntry = {
      id: weatherData.city?.properties?.iso_a3 ?? userLocation?.id,
      cityName: weatherData.city?.properties?.capital ?? userLocation?.name,
      avgTemp: 0,
      presipitationSum: 0,
      minTemp: 0,
      maxTemp: 0,
      cloudCover: 0,
      color: colors[index],
    };

    const times: Moment[] = [];
    const temperatures: number[] = [];
    const rainAmounts: number[] = [];
    const cloudCovers: number[] = [];

    const entryData: any = {};
    intervalEntries.forEach((entry: any, idx: number) => {
      const timestamp = moment(entry.timestamp).format(format);
      if (!entryData[timestamp]) {
        entryData[timestamp] = {};
      }

      const timestampValues = [
        { field: "temperature2m", value: entry.temperature_2m },
        { field: "rain", value: entry.rain },
        { field: "cloudCover", value: entry.cloudCover },
      ];

      timestampValues.forEach((entryValue) => {
        if (!entryData[timestamp][entryValue.field]) {
          entryData[timestamp][entryValue.field] = [];
        }
        if (!isNaN(entryValue.value)) {
          entryData[timestamp][entryValue.field].push(entryValue.value);
        }
      });

      times.push(entry.timestamp);
      temperatures.push(entry.temperature_2m);
      rainAmounts.push(entry.rain);
      cloudCovers.push(entry.cloudCover);
    });

    weatherData.entryData = entryData;

    weatherData.time.push(...times);
    weatherData.temperature2m.push(...temperatures);
    weatherData.rain.push(...rainAmounts);
    weatherData.cloudCover.push(...cloudCovers);

    tableEntry.avgTemp = calculateMean(weatherData.temperature2m);
    tableEntry.presipitationSum = weatherData.rain.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      0
    );
    tableEntry.minTemp = Math.min(...weatherData.temperature2m);
    tableEntry.maxTemp = Math.max(...weatherData.temperature2m);
    chartData.push(weatherData);
    tableData.push(tableEntry);
    console.log(chartData);
  });
  return { weatherData: chartData, tableData, colors, timesteps };
};
