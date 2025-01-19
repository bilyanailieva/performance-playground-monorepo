// src/components/WeatherCardWrapper.tsx
import CurrentWeatherCardServer from "./CurrentWeatherCardSSR";

export default async function WeatherCardWrapper({ location }: { location: any }) {
  if(!location) return <>No location</>;
  // Resolve the async Server Component
  return <>{await CurrentWeatherCardServer({ location })}</>;
}
