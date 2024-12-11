import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { UserLocation } from "@/stores/RootStore";
import { calculateMean } from "./ChartHelpers";
import { generateColors } from "./ColorGenerator";
import { momentDateToString } from "./FormatDate";
import { NestedTableData } from "@/components/TableLegend/TableLegend";

export const generateComboChartData = (
  apiData: any[],
  queryParams: any,
  userLocation?: UserLocation
) => {
  let chartData: any = [];
  let tableData: any[] = [];
  let colors: string[] = [];

  if (!apiData.length) return { weatherData: chartData, tableData, colors };
  colors = generateColors(queryParams.longitude);

  const data: any[] = [];
  const cityColumns: Set<string> = new Set(); // To dynamically track cities

  apiData.forEach((response: any, index: number) => {
    const timezone = response.cityInfo.timezone;
    const intervalEntries = response.values;

    const weatherData: any = {
      timeRange: {
        beginDate: momentDateToString(queryParams.start_date),
        endDate: momentDateToString(queryParams.end_date),
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
          weatherData.coords.latitude?.toFixed(2) &&
        feature.properties.longitude?.toFixed(2) ===
          weatherData.coords.longitude?.toFixed(2)
    );

    const cityName = city?.properties?.capital ?? userLocation?.name ?? timezone;
    cityColumns.add(cityName);

    intervalEntries?.forEach((entry: any) => {
      weatherData.time.push(entry.timestamp);
      weatherData.temperature2m.push(entry.temperature_2m);
      weatherData.rain.push(entry.rain);
      weatherData.cloudCover.push(entry.cloudCover);

      // Push the transformed data for the nested table
      let existingRow = tableData.find((row) => row.datetime === entry.timestamp);

      if (!existingRow) {
        existingRow = {
          datetime: entry.timestamp,
          metrics: [
            { metric: "Temperature", [cityName]: entry.temperature_2m },
            { metric: "Cloud Cover", [cityName]: entry.cloudCover },
            { metric: "Precipitation", [cityName]: entry.rain },
          ],
        };
        tableData.push(existingRow);
      } else {
        existingRow.metrics.forEach((metricRow: any) => {
          if (metricRow.metric === "Temperature") metricRow[cityName] = entry.temperature_2m;
          if (metricRow.metric === "Cloud Cover") metricRow[cityName] = entry.cloudCover;
          if (metricRow.metric === "Precipitation") metricRow[cityName] = entry.rain;
        });
      }
    });

    chartData.push(weatherData);
  });

  // Return the transformed data
  return { weatherData: chartData, tableData, colors, cityColumns: Array.from(cityColumns) };
};


export const generateDashboardData = (
  apiData: any[],
  queryParams: any,
  userLocation?: UserLocation
) => {
  let chartData: any = [];
  let tableData: any[] = [];
  let colors: string[] = [];

  if (!apiData.length) return { weatherData: chartData, tableData, colors };
  colors = generateColors(queryParams.longitude);

  const data: any[] = [];
  apiData.forEach((response: any, index: number) => {
    const timezone = response.cityInfo.timezone;
    const intervalEntries = response.values;

    const weatherData: any = {
      timeRange: {
        beginDate: momentDateToString(queryParams.start_date),
        endDate: momentDateToString(queryParams.end_date),
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
          weatherData.coords.latitude?.toFixed(2) &&
        feature.properties.longitude?.toFixed(2) ===
          weatherData.coords.longitude?.toFixed(2)
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

    intervalEntries?.forEach((entry: any, key: any) => {
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
