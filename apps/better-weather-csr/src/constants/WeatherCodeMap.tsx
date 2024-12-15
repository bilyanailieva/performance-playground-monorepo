import {
    IconSun,
    IconCloud,
    IconCloudRain,
    IconCloudStorm,
    IconSnowflake,
    IconCloudFog,
    IconMist
  } from "@tabler/icons-react";
  
export const weatherCodeMap: { [key: number]: { description: string; icon: JSX.Element } } = {
    0: { description: "Clear sky", icon: <IconSun stroke={2} width={60} height={60} /> },
    1: { description: "Mainly clear", icon: <IconSun stroke={2} width={60} height={60} /> },
    2: { description: "Partly cloudy", icon: <IconCloud stroke={2} width={60} height={60} /> },
    3: { description: "Overcast", icon: <IconCloud stroke={2} width={60} height={60} /> },
    45: { description: "Fog", icon: <IconCloudFog stroke={2} width={60} height={60} /> },
    48: { description: "Depositing rime fog", icon: <IconCloudFog stroke={2} width={60} height={60} /> },
    51: { description: "Light drizzle", icon: <IconMist stroke={2} width={60} height={60} /> },
    53: { description: "Moderate drizzle", icon: <IconMist stroke={2} width={60} height={60} /> },
    55: { description: "Dense drizzle", icon: <IconMist stroke={2} width={60} height={60} /> },
    61: { description: "Slight rain", icon: <IconCloudRain stroke={2} width={60} height={60} /> },
    63: { description: "Moderate rain", icon: <IconCloudRain stroke={2} width={60} height={60} /> },
    65: { description: "Heavy rain", icon: <IconCloudRain stroke={2} width={60} height={60} /> },
    71: { description: "Slight snow fall", icon: <IconSnowflake stroke={2} width={60} height={60} /> },
    73: { description: "Moderate snow fall", icon: <IconSnowflake stroke={2} width={60} height={60} /> },
    75: { description: "Heavy snow fall", icon: <IconSnowflake stroke={2} width={60} height={60} /> },
    77: { description: "Snow grains", icon: <IconSnowflake stroke={2} width={60} height={60} /> },
    95: { description: "Thunderstorm", icon: <IconCloudStorm stroke={2} width={60} height={60} /> },
    96: { description: "Thunderstorm with slight hail", icon: <IconCloudStorm stroke={2} width={60} height={60} /> },
    99: { description: "Thunderstorm with heavy hail", icon: <IconCloudStorm stroke={2} width={60} height={60} /> },
  };
  