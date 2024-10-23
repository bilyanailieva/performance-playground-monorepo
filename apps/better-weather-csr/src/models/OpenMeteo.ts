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

export type OpenMeteoParams = {
  latitude?: number;
  longitude?: number;
  start_date?: string;
  end_date?: string;
  hourly?: WeatherParams[];
  daily?: WeatherParams[];
  current?: WeatherParams[];
  timezone?: string;
};
