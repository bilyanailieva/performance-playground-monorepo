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

export const getLocation = (): Promise<UserLocation | undefined> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const userTimezone =
              Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log(position);
            const { latitude, longitude } = position.coords;
            const city = await fetchCity(latitude, longitude);
            console.log(city)
            resolve({
              name: city.address.city,
              id: city.osm_id,
              country: city.address.country,
              location: {
                longitute: longitude,
                latitude,
                timezone: userTimezone,
              },
            });
          } catch (error) {
            console.error("Error fetching city", error);
            reject(error);
          }
        },
        (error) => {
          console.error("Error fetching geolocation", error);
          reject(error);
        }
      );
    } else {
      resolve(undefined);
    }
  });
};

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
