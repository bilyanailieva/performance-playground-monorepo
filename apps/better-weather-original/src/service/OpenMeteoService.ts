import moment from "moment-timezone";
import { fetchWeatherApi } from "openmeteo";

import RootStore, { UserLocation } from "@/stores/RootStore";
import { WeatherApiResponse } from "@openmeteo/sdk/weather-api-response";
import axios from "axios";

export enum WeatherParams {
  "temperature_2m" = "temperature_2m",
  "precipitation" = "precipitation",
  "rain" = "rain",
  "snowfall" = "snowfall",
  "weather_code" = "weather_code",
  "temperature_2m_mean" = "temperature_2m_mean",
  "apparent_temperature" = "apparent_temperature",
  "precipitation_sum" = "precipitation_sum",
  "cloud_cover" = "cloud_cover",
}

type OpenMeteoParams = {
  latitude?: number;
  longitude?: number;
  start_date?: string;
  end_date?: string;
  hourly?: WeatherParams[];
  daily?: WeatherParams[];
  current?: WeatherParams[];
  timezone?: string;
};

export type CurrentWeatherData = {
  current: {
    time: Date;
    temperature2m: number;
    apparentTemperature: number;
  };
};

export const fetchHistoricalDataForCity = async (params: OpenMeteoParams) => {
  const url = "https://archive-api.open-meteo.com/v1/archive";
  const responses = await fetchWeatherApi(url, params);
  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  let weatherData: any = {
    daily: {
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) =>
        moment
          .parseZone(t * 1000)
          .tz("Europe/Berlin")
          .format("ddd, HH:mm")
      ),
      temperature2mMean: daily.variables(0)!.valuesArray()!,
      precipitation: daily.variables(1)!.valuesArray()!,
    },
  };
  if (hourly !== null) {
    weatherData = {
      ...weatherData,
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) =>
          moment
            .parseZone(t * 1000)
            .tz("Europe/Berlin")
            .format("ddd, HH:mm")
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        precipitation: hourly.variables(1)!.valuesArray()!,
        rain: hourly.variables(2)!.valuesArray()!,
        snowfall: hourly.variables(3)!.valuesArray()!,
        weatherCode: hourly.variables(4)!.valuesArray()!,
      },
    };
  }
  let tableData: any[] = [];
  // `weatherData` now contains a simple structure with arrays for datetime and weather data
  for (let i = 0; i < weatherData.hourly.time.length; i++) {
    const tableEntry = {
      time: weatherData.hourly.time[i],
      temperature2m: weatherData.hourly.temperature2m[i],
      rain: weatherData.hourly.precipitation[i],
      snowfall: weatherData.hourly.snowfall[i],
      weatherCode: weatherData.hourly.weatherCode[i],
    };
    tableData.push(tableEntry);
  }
  // for (let i = 0; i < weatherData.daily.time.length; i++) {
  //   // console.log(
  //   //   weatherData.daily.time[i].toISOString(),
  //   //   weatherData.daily.weatherCode[i],
  //   //   weatherData.daily.temperature2mMean[i]
  //   // );
  // }
  return { weatherData, tableData };
};

export const fetchHistoricalDataForMultipleCities = async (params: any) => {
  if (
    !params.longitude.length ||
    !params.latitude.length ||
    !params.start_date ||
    !params.end_date
  ) {
    return [];
  }
  console.log("here");
  const responses = await axios.get("http://localhost:8081/history", {
    params: params,
    paramsSerializer: (params) => {
      // Custom serializer to correctly handle array parameters
      const qs = Object.keys(params)
        .map((key) => {
          const value = params[key];
          return Array.isArray(value)
            ? value.map((val) => `${key}=${val}`).join("&")
            : `${key}=${value}`;
        })
        .join("&");
      return qs;
    },
  });
  return responses.data;
};

export const fetchForecastData = async (params: any) => {
  if (
    !params.longitude.length ||
    !params.latitude.length ||
    !params.start_date ||
    !params.end_date
  ) {
    return [];
  }
  const responses = await axios.get("http://localhost:8081/forecast", {
    params: params,
    paramsSerializer: (params) => {
      // Custom serializer to correctly handle array parameters
      const qs = Object.keys(params)
        .map((key) => {
          const value = params[key];
          return Array.isArray(value)
            ? value.map((val) => `${key}=${val}`).join("&")
            : `${key}=${value}`;
        })
        .join("&");
      return qs;
    },
  });
  return responses.data;
};

export const fetchCurrentDataForCity = async (
  params: OpenMeteoParams
): Promise<CurrentWeatherData> => {
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const current = response.current()!;

  const utcOffsetSeconds = response.utcOffsetSeconds();

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      apparentTemperature: current.variables(1)!.value(),
    },
  };

  return weatherData;
};

export const fetchEuropeanWeatherData = async (
  params: any,
  geoData: any[]
): Promise<any> => {
  let data: any[] = [];
  const { isoKeys, ...relParams } = params;
  const responses = await fetchHistoricalData(relParams);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  responses.forEach((response: any, index) => {
    const timezone = response.timezone();
    const daily = response.hourly()!;
    const timeArray = range(
      Number(daily.time()),
      Number(daily.timeEnd()),
      daily.interval()
    ).map((t) => {
      return moment.parseZone(t * 1000).tz(timezone);
    });

    data.push({
      time: timeArray,
      value: daily.variables(0)!.valuesArray()!,
      feature: geoData.find(
        (feature) => feature.properties.iso_a3 === params.isoKeys[index]
      ),
    });
  });

  return data;
};

export const fetchHistoricalData = async (
  params: OpenMeteoParams
): Promise<WeatherApiResponse[]> => {
  const url = "https://archive-api.open-meteo.com/v1/archive";
  return await fetchWeatherApi(url, params);
};

export const getForecastDataParams = async (rootStore: RootStore) => {
  let userLocation: UserLocation | undefined = undefined;
  const cachedLocation = localStorage.getItem("location");
  console.log(localStorage.getItem("location"));
  if (cachedLocation) {
    console.log(JSON.parse(cachedLocation));
    userLocation = JSON.parse(cachedLocation);
  } else {
    const location = rootStore.userLocation();
    if (location) {
      localStorage.setItem("location", JSON.stringify(location));
      userLocation = location;
    }
  }
  return {
    latitude: [userLocation?.location?.latitude],
    longitude: [userLocation?.location?.longitute],
    start_date: rootStore.headerControls?.beginDate,
    end_date: rootStore.headerControls?.endDate,
    hourly: [
      WeatherParams.temperature_2m,
      WeatherParams.precipitation,
      WeatherParams.rain,
      WeatherParams.snowfall,
      WeatherParams.weather_code,
      WeatherParams.cloud_cover,
    ],
    daily: [WeatherParams.temperature_2m_mean, WeatherParams.precipitation_sum],
    timezone: "auto",
  };
};
