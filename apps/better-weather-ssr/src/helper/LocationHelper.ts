"use client";

import { UserLocation } from "@/stores/RootStore";

export const fetchCity = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch city name");
    }
    const data = await response.json();
    const city = data;
    return city;
  } catch (error: any) {
    console.error(error?.message);
  }
};

// Server-safe location fetching
export const getLocation = async (): Promise<UserLocation | undefined> => {
  try {
    // Use IP-based geolocation to fetch user location
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to fetch server-side location");
    }

    const locationData = await response.json();

    // Process and return the user location
    return {
      name: locationData.city || "Unknown City",
      id: locationData.postal || "Unknown ID",
      country: locationData.country_name || "Unknown Country",
      location: {
        latitude: locationData.latitude,
        longitute: locationData.longitude,
        timezone: locationData.timezone,
      },
    };
  } catch (error) {
    console.error("Error fetching location server-side:", error);

    // Fallback to default location
    return {
      name: "Default City",
      id: -1,
      country: "Default Country",
      location: {
        latitude: 40.7128, // Default latitude (e.g., New York City)
        longitute: -74.006, // Default longitude
        timezone: "America/New_York", // Default timezone
      },
    };
  }}



export const getLocationByName = async (name: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${name}&format=json&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const { osm_id, lat, lon, adress } = data[0];
      return {
        name: adress.city,
        id: osm_id,
        country: adress.country,
        location: {
          latitude: Number(lat),
          longitute: Number(lon),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };
    } else {
      return null; // Handle case where no location is found
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};
