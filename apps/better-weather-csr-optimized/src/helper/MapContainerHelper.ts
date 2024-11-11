"use client";
import moment from "moment";
import { europeanCapitals } from "./eu-countries-capitals.geo";

export const processWeatherData = (data: any, params: any) => {
  const feData: any = [];
  console.log(data);
  const locations = params.isoKeys;

  const monthlyData: any = {};

  data.forEach((city: any, index: number) => {
    const iso_a3 = locations[index];
    city.values.forEach((entry: any, i: number) => {
      const date = moment(entry.timestamp).format("MMM-yy");
      if (!monthlyData[date]) {
        monthlyData[date] = [];
      }
      if (!monthlyData[date][iso_a3]) {
        monthlyData[date][iso_a3] = [];
      }
      monthlyData[date][iso_a3].push(entry.temperature_2m);
    });
  });

  const frames = Object.keys(monthlyData).map((month) => {
    const monthData = monthlyData[month];
    const zValues = locations.map((iso_a3: any) => {
      const values = monthData[iso_a3];
      if (values && values.length) {
        const sum = values.reduce((acc: number, val: number) => acc + val, 0);
        return sum / values.length;
      }
      return null;
    });
    return {
      name: month,
      data: [
        {
          type: "choropleth",
          locationmode: "ISO-3",
          locations: locations,
          z: zValues,
          geojson: europeanCapitals,
        },
      ],
    };
  });

  const steps = Object.keys(monthlyData).map((month) => {
    return {
      label: month,
      method: "animate",
      args: [
        [month],
        {
          mode: "immediate",
          transition: { duration: 2 },
          frame: { duration: 2 },
        },
      ],
    };
  });

  return { weatherData: data, locations, frames, steps };
};
