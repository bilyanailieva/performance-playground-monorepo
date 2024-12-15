"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./CurrentWeatherCard.module.scss";

import { rootStoreContext } from "@/app/layout";
import {
  CurrentWeatherData,
  WeatherParams,
  fetchCurrentDataForCity,
} from "@/service/OpenMeteoService";
import { IconCloud, IconSun } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

const CurrentWeatherCard = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const location = rootStore.selectedLocation;
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(rootStore.selectedLocation);
    const fetchWeather = async (params: any) => {
      try {
        const response = await fetchCurrentDataForCity(params);
        if (!response) {
          throw new Error("Network response was not ok");
        }
        if (!response?.current) return;
        setWeatherData(response);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (location) {
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
      fetchWeather(params);
    }
  }, [rootStore.selectedLocation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return null;
  }

  const { temperature2m, weatherCode, apparentTemperature } =
    weatherData.current;

  return (
    <div className={styles.weatherCard}>
      <h2>{location?.name}</h2>
      {weatherCode.icon}
      <div>
        <p className="font-extrabold text-3xl">{temperature2m.toFixed()}°C</p>
        <p>Feels like {apparentTemperature.toFixed()}°C</p>
      </div>
    </div>
  );
});

export default CurrentWeatherCard;
