import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { UserLocation } from "@/stores/RootStore";
import { calculateMean, chooseInterval } from "@/utils/ChartHelpers";
import { intervalToDateFormat } from "@/utils/FormatDate";
import { getTimestepsByTimeRange } from "@/utils/WeatherInfoHelpers";
import { time } from "console";
import moment, { Moment } from "moment";

export const generateLineChartData = (
  apiData: any,
  cityColors: string[],
  location?: UserLocation,
  field?: string,
  viewMode?: "hourly" | "daily" | "monthly" | 'auto'
) => {
  let data: any = [];
  if (apiData.length) {
    let interval: "hourly" | "daily" | "monthly" | "auto" = "auto";
    if (viewMode) {
      interval = viewMode;
    }
    if(interval === 'auto') {
      interval = chooseInterval(apiData[0].timeRange);
    }
    console.log(interval);
    // if (interval === "monthly") {
    //   data = getMonthlyLineData(apiData, cityColors);
    // } else if (field === "minMax") {
    data = getDailyLineData(apiData, interval, cityColors, location);
    // }
    //  else if (interval === "daily") {
    //   data = getDailyMeanLineData(apiData, cityColors);
    // }
  }
  return data;
};

const getMonthlyLineData = (apiData: any, cityColors: string[]) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "monthly");
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
  viewMode: "hourly" | "daily" |'monthly',
  cityColors: string[],
  location?: UserLocation
) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, viewMode);
  console.log(timesteps);
  const format = intervalToDateFormat(viewMode);
  console.log(viewMode);
  const finalData: any[] = [];

  apiData.forEach((cityInfo: any, index: number) => {
    const entryData: any = {};

    // Iterate through each timestamp and group data by day
    cityInfo.time.forEach((timestamp: Moment, index: number) => {
      const day = moment(timestamp).startOf("hour").format(format);
      if (!entryData[day]) {
        entryData[day] = [];
      }
      const value = cityInfo.temperature2m[index];

      // Check if the value is a valid number before pushing
      if (!isNaN(value)) {
        entryData[day].push(value);
      }
    });

    const pointColors = Object.keys(entryData).flatMap((key: any) => {
      const val = entryData[key];
      return val.map((entry: number) => {
        if (entry < -10) {
          return 'darkblue';
        } else if (entry >= -10 && entry < 5) {
          return 'lightblue';
        } else if (entry >= 5 && entry < 22) {
          return 'green';
        } else if (entry >= 22 && entry < 32) {
          return 'yellow';
        } else if (entry >= 32) {
          return 'red';
        } else {
          return 'green'; // Default case
        }
      });
    });
    console.log(pointColors);

    const getSegmentColor = (ctx: any) => {
      const { p0, p1 } = ctx; // p0 and p1 represent the two points of the segment
      const point = p1.parsed.y
      if (point < -10) return 'darkblue';
      if (point >= -10 && point < 5) return 'lightblue';
      if (point >= 5 && point < 22) return 'green';
      if (point >= 22 && point < 32) return 'yellow';
      if (point >= 32) return 'red';
      return 'gray'; // Default case
    };

    if (viewMode === "hourly") {
        finalData.push({
          label: `Hourly temperature`,
          data: entryData,
          pointBorderColor: pointColors,
          pointBackgroundColor: pointColors,
          pointRadius: 3, // Customize point size
          borderWidth: 3,
          yAxisID: "yAxis",
          xAxisID: "xAxis",
          elements: {
            line: {
              tension: 0.4, // Smooth lines
            }
          },
          segment: {
            borderColor: getSegmentColor, // Use the function to color line segments
          }
        });
    } else {
      // Calculate the daily average and format to one decimal place
      const entryFinal = Object.keys(entryData).map((day) => {
        return Math.max(...entryData[day])?.toFixed(1);
      });

      // Calculate the daily average and format to one decimal place
      const entryFinal2 = Object.keys(entryData).map((day) => {
        return Math.min(...entryData[day])?.toFixed(1);
      });
      console.log(entryFinal2);

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
    }
  });

  // Return datasets with daily labels
  return { datasets: finalData, labels: timesteps };
};

const getDailyMeanLineData = (apiData: any, cityColors: string[]) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "daily");
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
