import { UserLocation } from "@/stores/RootStore";
import { calculateMean } from "@/utils/ChartHelpers";
import { getTimestepsByTimeRange } from "@/utils/WeatherInfoHelpers";

export const generateLineChartData = (
  apiData: any,
  cityColors: string[],
  location?: UserLocation,
  field?: string
) => {
  const finalData: any[] = [];
  if (!apiData.length) return { datasets: [], labels: [] };
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = cityInfo.entryData;
    const entryFinal = Object.keys(entryData).map((data) => {
      return calculateMean(entryData[data].temperature2m)?.toFixed(1);
    });
    finalData.push({
      label: cityInfo?.city?.properties?.name ?? "Hello",
      data: entryFinal,
      borderColor: cityColors[index],
      pointBackgroundColor: cityColors[index],
      fill: false,
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    });
  });
  return { datasets: finalData, labels: [] };
};

const getMonthlyLineData = (apiData: any, cityColors: string[]) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "month");
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = cityInfo.entryData;
    const entryFinal = Object.keys(entryData).map((data) => {
      return calculateMean(entryData[data].temperature2m)?.toFixed(1);
    });
    finalData.push({
      label: cityInfo?.city?.properties?.name ?? "Hello",
      data: entryFinal,
      borderColor: cityColors[index],
      pointBackgroundColor: cityColors[index],
      fill: false,
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    });
  });
  return { datasets: finalData, labels: [] };
};

const getDailyLineData = (
  apiData: any,
  cityColors: string[],
  location?: UserLocation
) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "day");
  const finalData: any[] = [];
  console.log(apiData);

  apiData.forEach((cityInfo: any, index: number) => {
    const entryData = cityInfo.entryData;

    // Calculate the daily average and format to one decimal place
    const entryFinal = Object.keys(entryData).map((day) => {
      return Math.max(...entryData[day].temperature2m)?.toFixed(1);
    });

    // Calculate the daily average and format to one decimal place
    const entryFinal2 = Object.keys(entryData).map((day) => {
      return Math.min(...entryData[day].temperature2m)?.toFixed(1);
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
  // const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "day");
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData = cityInfo.entryData;
    const entryFinal = Object.keys(entryData).map((data) => {
      return calculateMean(entryData[data].temperature2m)?.toFixed(1);
    });
    finalData.push({
      label: cityInfo?.city?.properties?.name ?? "Hello",
      data: entryFinal,
      borderColor: cityColors[index],
      pointBackgroundColor: cityColors[index],
      fill: false,
      tension: 1,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
    });
  });
  return { datasets: finalData, labels: [] };
};
