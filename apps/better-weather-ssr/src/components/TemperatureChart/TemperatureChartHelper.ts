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
    data = getDailyLineData(apiData, interval, cityColors, location);
  }
  return data;
};

const getDailyLineData = (
  apiData: any,
  viewMode: "hourly" | "daily" | "monthly",
  cityColors: string[],
  location?: UserLocation
) => {
  const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, viewMode);
  const format = intervalToDateFormat(viewMode);
  const finalData: any[] = [];

  apiData.forEach((cityInfo: any, cityIndex: number) => {
    const entryData: Record<string, number[]> = {};

    // Group data by the appropriate time granularity
    cityInfo.time.forEach((timestamp: Moment, index: number) => {
      const timeKey = moment(timestamp).startOf("hour").format(format);

      if (!entryData[timeKey]) {
        entryData[timeKey] = [];
      }
      const value = cityInfo.temperature2m[index];

      if (!isNaN(value)) {
        entryData[timeKey].push(value);
      }
    });

    let processedData;
    if (viewMode === "hourly") {
      // No aggregation needed for hourly
      processedData = Object.keys(entryData).map((key) => ({
        x: key,
        y: entryData[key][0],
      }));
    } else {
      // Aggregate for daily and monthly views
      processedData = Object.keys(entryData).map((key) => ({
        x: key,
        y: (entryData[key].reduce((sum, val) => sum + val, 0) / entryData[key].length).toFixed(1), // Average
      }));
    }

    const getSegmentColor = (ctx: any) => {
      const { p0, p1 } = ctx;
      const point = p1.parsed.y;
      if (point < -10) return "darkblue";
      if (point >= -10 && point < 5) return "lightblue";
      if (point >= 5 && point < 22) return "green";
      if (point >= 22 && point < 32) return "yellow";
      if (point >= 32) return "red";
      return "gray";
    };

    const cityColor = cityColors[cityIndex] || "gray";
    finalData.push({
      label: `${cityInfo.cityName || location?.name || `City ${cityIndex + 1}`} - ${viewMode} average`,
      data: processedData,
      borderColor: cityColor,
      pointBackgroundColor: cityColor,
      pointRadius: 3,
      borderWidth: 3,
      yAxisID: "yAxis",
      xAxisID: "xAxis",
      elements: {
        line: {
          tension: 0.4,
        },
      },
      segment: {
        borderColor: getSegmentColor,
      },
    });
  });

  return { datasets: finalData, labels: timesteps };
};

