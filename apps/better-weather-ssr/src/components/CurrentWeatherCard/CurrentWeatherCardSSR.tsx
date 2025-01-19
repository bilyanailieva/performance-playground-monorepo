import { CurrentWeatherData, fetchCurrentDataForCity, WeatherParams } from "@/service/OpenMeteoService";
import CurrentWeatherCardClient from "./CurrentWeatherCard";

async function fetchWeatherData(location: any): Promise<CurrentWeatherData | null> {
  if (!location) return null;

  const params = {
    latitude: location?.location?.latitude,
    longitude: location?.location?.longitute,
    current: [
      WeatherParams.temperature_2m,
      WeatherParams.apparent_temperature,
      WeatherParams.weather_code,
    ],
    timezone: location?.location?.timezone ?? "Europe/Sofia",
  };

  try {
    const weatherData = await fetchCurrentDataForCity(params);
    return weatherData ?? null;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null; // Return null if data fetching fails
  }
}

export default async function CurrentWeatherCardServer({ location }: { location: any }) {
  if(!location) return;
  const weatherData = await fetchWeatherData(location);

  return (
    <div>
      <CurrentWeatherCardClient weatherData={weatherData} location={location} />
    </div>
  );
}
