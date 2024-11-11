"use client";
import { calculateSum } from "@/utils/ChartHelpers";

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
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData = cityInfo.entryData;
    if (Object.keys(entryData).length) {
      const entryFinal = Object.keys(entryData).map((month) =>
        calculateSum(entryData[month].rain)
      );
      finalData.push({
        label: cityInfo?.city?.properties.name,
        data: entryFinal,
        backgroundColor: cityColors[index],
        borderColor: cityColors[index],
      });
    }
  });
  return { datasets: finalData, labels: [] };
};

const getMonthlyData = (apiData: any, cityColors: string[]) => {
  // const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "month");
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData = cityInfo.entryData;
    if (Object.keys(entryData).length) {
      const entryFinal = Object.keys(entryData).map((month) =>
        calculateSum(entryData[month].rain)
      );
      finalData.push({
        label: cityInfo?.city?.properties.name,
        data: entryFinal,
        backgroundColor: cityColors[index],
        borderColor: cityColors[index],
      });
    }
  });
  return { datasets: finalData, labels: [] };
};

const getDailyData = (apiData: any, cityColors: string[]) => {
  const finalData: any[] = [];
  apiData.forEach((cityInfo: any, index: number) => {
    const entryData = cityInfo.entryData;
    if (Object.keys(entryData).length) {
      const entryFinal = Object.keys(entryData).map((month) =>
        calculateSum(entryData[month].rain)
      );
      finalData.push({
        label: cityInfo?.city?.properties.name,
        data: entryFinal,
        backgroundColor: cityColors[index],
        borderColor: cityColors[index],
      });
    }
  });
  return { datasets: finalData, labels: [] };
};
