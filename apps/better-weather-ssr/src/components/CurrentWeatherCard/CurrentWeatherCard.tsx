"use client";

import styles from "./CurrentWeatherCard.module.scss";

export default function CurrentWeatherCardClient({ weatherData, location }: { weatherData: any; location: any }) {
  if (!weatherData) {
    return <div className={styles.weatherCard}>Unable to load weather data. Please try again later.</div>;
  }

  const { temperature2m, weatherCode, apparentTemperature } = weatherData.current;

  return (
    <div className={styles.weatherCard}>
      <h2>{location?.name ?? "Unknown Location"}</h2>
      {weatherCode.icon}
      <div>
        <p className="font-extrabold text-3xl">{temperature2m?.toFixed()}°C</p>
        <p>Feels like {apparentTemperature?.toFixed()}°C</p>
      </div>
    </div>
  );
}
