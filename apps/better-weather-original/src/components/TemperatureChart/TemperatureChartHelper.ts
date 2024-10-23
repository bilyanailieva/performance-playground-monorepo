import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { UserLocation } from "@/stores/RootStore";
import { calculateMean, chooseInterval } from "@/utils/ChartHelpers";
import { getTimestepsByTimeRange } from "@/utils/WeatherInfoHelpers";
import moment, { Moment } from "moment";

export const generateLineChartData = (
  apiData: any,
  cityColors: string[],
  location?: UserLocation,
  field?: string
) => {
  let data: any = [];
  if (apiData.length) {
    const interval = chooseInterval(apiData[0].timeRange);
    if (interval === "month") {
      data = getMonthlyLineData(apiData, cityColors);
    } else if (interval === "day" && field === "minMax") {
      data = getDailyLineData(apiData, cityColors, location);
    } else if (interval === "day") {
      data = getDailyMeanLineData(apiData, cityColors);
    }
  }
  return data;
};

const getMonthlyLineData = (apiData: any, cityColors: string[]) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "month");
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = {};
    cityInfo.time.forEach((timestamp: Moment, index: number) => {
      const month = moment(timestamp).format("MMM-yy");
      if (!entryData[month]) {
        entryData[month] = [];
      }
      const value = cityInfo.temperature2m[index];
      if (!isNaN(value)) {
        entryData[month].push(value);
      }
    });
    const entryFinal = Object.keys(entryData).map((data) => {
      return calculateMean(entryData[data])?.toFixed(1);
    });
    const cityName = europeanCapitals.features.find(
      (feature) =>
        feature.properties.latitude?.toFixed(2) ===
          cityInfo.coords.latitude.toFixed(2) &&
        feature.properties.longitude?.toFixed(2) ===
          cityInfo.coords.longitude.toFixed(2)
    );
    finalData.push({
      label: cityName?.properties?.name ?? "Hello",
      data: entryFinal,
      borderColor: cityColors[index],
      pointBackgroundColor: cityColors[index],
      fill: false,
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    });
  });
  return { datasets: finalData, labels: timesteps };
};

const getDailyLineData = (
  apiData: any,
  cityColors: string[],
  location?: UserLocation
) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "day");
  const finalData: any[] = [];

  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = {};

    // Iterate through each timestamp and group data by day
    cityInfo.time.forEach((timestamp: Moment, index: number) => {
      const day = moment(timestamp).format("DD-MM-YYYY");
      if (!entryData[day]) {
        entryData[day] = [];
      }
      const value = cityInfo.temperature2m[index];

      // Check if the value is a valid number before pushing
      if (!isNaN(value)) {
        entryData[day].push(value);
      }
    });

    // Calculate the daily average and format to one decimal place
    const entryFinal = Object.keys(entryData).map((day) => {
      return Math.max(...entryData[day])?.toFixed(1);
    });

    // Calculate the daily average and format to one decimal place
    const entryFinal2 = Object.keys(entryData).map((day) => {
      return Math.min(...entryData[day])?.toFixed(1);
    });

    // Push the formatted data for the city
    finalData.push({
      label: `Max daily temp`,
      data: entryFinal,
      borderColor: "red",
      pointBackgroundColor: "red",
      fill: false,
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    });
    finalData.push({
      label: `Min daily temp`,
      data: entryFinal2,
      borderColor: "blue",
      pointBackgroundColor: "blue",
      fill: false,
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    });
  });

  // Return datasets with daily labels
  return { datasets: finalData, labels: timesteps };
};

const getDailyMeanLineData = (apiData: any, cityColors: string[]) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "day");
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = {};
    cityInfo.time.forEach((timestamp: Moment, index: number) => {
      const month = moment(timestamp).format("DD-MM-yy");
      if (!entryData[month]) {
        entryData[month] = [];
      }
      const value = cityInfo.temperature2m[index];
      if (!isNaN(value)) {
        entryData[month].push(value);
      }
    });
    const entryFinal = Object.keys(entryData).map((data) => {
      return calculateMean(entryData[data])?.toFixed(1);
    });
    const cityName = europeanCapitals.features.find(
      (feature) =>
        feature.properties.latitude?.toFixed(2) ===
          cityInfo.coords.latitude.toFixed(2) &&
        feature.properties.longitude?.toFixed(2) ===
          cityInfo.coords.longitude.toFixed(2)
    );
    finalData.push({
      label: cityName?.properties?.name ?? "Hello",
      data: entryFinal,
      borderColor: cityColors[index],
      pointBackgroundColor: cityColors[index],
      fill: false,
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    });
  });
  return { datasets: finalData, labels: timesteps };
};
