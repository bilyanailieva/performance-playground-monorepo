"use client";
import { calculateSum, chooseInterval } from "@/utils/ChartHelpers";
import { getTimestepsByTimeRange } from "@/utils/WeatherInfoHelpers";
import moment, { Moment } from "moment";
import { europeanCapitals } from "./eu-countries-capitals.geo";

export const generateBasicLineChartData = (weatherData: any) => {
  const dataSets = weatherData.map((data: any, index: number) => {
    return {
      label: index.toString(),
      data: data.temperature2m,
      fill: false,
      borderColor: "red",
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    };
  });
  return {
    labels: weatherData[0].time,
    datasets: dataSets,
  };
};

export const generateBarChartData = (apiData: any, cityColors: string[]) => {
  let data: any = [];
  if (apiData.length) {
    const interval = chooseInterval(apiData[0].timeRange);
    if (interval === "month") {
      data = getMonthlyData(apiData, cityColors);
    } else if (interval === "day") {
      data = getDailyData(apiData, cityColors);
    }
  }
  return data;
};

const getMonthlyData = (apiData: any, cityColors: string[]) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "month");
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = {};
    cityInfo.time.forEach((timestamp: Moment, index: number) => {
      const month = moment(timestamp).format("MMM-yy");
      if (!entryData[month]) {
        entryData[month] = [];
      }
      const value = cityInfo.rain[index];
      if (!isNaN(value)) {
        entryData[month].push(value);
      }
    });
    if (Object.keys(entryData).length) {
      const entryFinal = Object.keys(entryData).map((month) =>
        calculateSum(entryData[month])
      );
      const cityName = europeanCapitals.features.find(
        (feature) =>
          feature.properties.latitude?.toFixed(2) ===
            cityInfo.coords.latitude.toFixed(2) &&
          feature.properties.longitude?.toFixed(2) ===
            cityInfo.coords.longitude.toFixed(2)
      );
      finalData.push({
        label: cityName?.properties.name,
        data: entryFinal,
        backgroundColor: cityColors[index],
        borderColor: cityColors[index],
      });
    }
  });
  return { datasets: finalData, labels: timesteps };
};

const getDailyData = (apiData: any, cityColors: string[]) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "day");
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = {};
    cityInfo.time.forEach((timestamp: Moment, index: number) => {
      const month = moment(timestamp).format("DD-MM-yy");
      if (!entryData[month]) {
        entryData[month] = [];
      }
      const value = cityInfo.rain[index];
      if (!isNaN(value)) {
        entryData[month].push(value);
      }
    });
    if (Object.keys(entryData).length) {
      const entryFinal = Object.keys(entryData).map((month) =>
        calculateSum(entryData[month])
      );
      const cityName = europeanCapitals.features.find(
        (feature) =>
          feature.properties.latitude?.toFixed(2) ===
            cityInfo.coords.latitude.toFixed(2) &&
          feature.properties.longitude?.toFixed(2) ===
            cityInfo.coords.longitude.toFixed(2)
      );
      finalData.push({
        label: cityName?.properties.name,
        data: entryFinal,
        backgroundColor: cityColors[index],
        borderColor: cityColors[index],
      });
    }
  });
  return { datasets: finalData, labels: timesteps };
};
