import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { calculateMean } from "@/utils/ChartHelpers";
import moment, { Moment } from "moment";

export const generateCloudCoverageData = (data: any, cityColors: string[]) => {
  if (!data?.length) return [];
  const finalData: any = [];
  data.forEach((city: any) => {
    const entryData: any = {};
    const processedData: any = {
      nighttime: [],
      morning: [],
      afternoon: [],
      evening: [],
    };
    city.time.forEach((entry: any, index: number) => {
      const date = moment(entry).format("DD-MMM-yy");
      if (!entryData[date]) {
        entryData[date] = {};
      }
      const datetime = calculateTimeOfDay(entry);
      if (!entryData[date][datetime]) {
        entryData[date][datetime] = [];
      }
      const value = city.cloudCover[index];
      if (!isNaN(value)) {
        entryData[date][datetime].push(value);
      }
    });
    Object.keys(entryData).forEach((key) => {
      processedData.nighttime.push(...entryData[key].nighttime);
      processedData.morning.push(...entryData[key].morning);
      processedData.afternoon.push(...entryData[key].afternoon);
      processedData.evening.push(...entryData[key].evening);
    });
    finalData.push({ data: processedData, coords: city.coords });
  });
  const chartData = finalData.map((dataEntry: any, index: number) => {
    const cityName: any | undefined = europeanCapitals.features.find(
      (feature) =>
        feature.properties.latitude?.toFixed(2) ===
          dataEntry.coords.latitude?.toFixed(2) &&
        feature.properties.longitude?.toFixed(2) ===
          dataEntry.coords.longitude?.toFixed(2)
    );
    return {
      label: cityName?.properties?.name,
      borderColor: cityColors[index],
      pointBackgroundColor: cityColors[index],
      pointBorderColor: cityColors[index],
      fill: true,
      backgroundColor: convertHex(cityColors[index], 0.1),
      pointHoverBackgroundColor: cityColors[index],
      pointHoverBorderColor: cityColors[index],
      data: Object.keys(dataEntry?.data).map((key) => {
        return calculateMean(dataEntry.data[key]);
      }),
    };
  });
  return chartData;
};

const calculateTimeOfDay = (timeEntry: Moment) => {
  const hour = moment(timeEntry).hours();
  if (hour < 6) {
    return "nighttime";
  } else if (hour >= 6 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
};

function convertHex(hexCode: string, opacity = 1) {
  var hex = hexCode?.replace("#", "");

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  var r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }

  return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
}
