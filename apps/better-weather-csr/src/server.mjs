import axios from "axios";
import moment from "moment";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const app = new Elysia().use(cors());

const fetchOpenMeteoData = async (url, params) => {
  try {
    const resp = await axios.get(url, { params });
    let data = [];
    const apiData = !Array.isArray(resp.data) ? [resp.data] : resp.data;
    if (apiData.length > 0) {
      apiData.forEach((response) => {
        const timezone = response.timezone;
        const intervalInfo = response?.hourly;
        const values = [];
        intervalInfo?.time.forEach((timestamp, index) => {
          const date = moment(timestamp);
          values.push({
            timestamp: date,
            temperature_2m: intervalInfo.temperature_2m?.[index],
            precipitation: intervalInfo.precipitation?.[index],
            rain: intervalInfo.rain?.[index],
            snowfall: intervalInfo.snowfall?.[index],
            weatherCode: intervalInfo.weather_code?.[index],
            cloudCover: intervalInfo.cloud_cover?.[index],
          });
        });

        data.push({
          cityInfo: { timezone }, // Placeholder for city info
          values,
        });
      });
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it outside the function if needed
  }
};


// Route to fetch forecast data
app.get("/forecast", async (req) => {
  console.log("Route /forecast has been registered.");
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const queryParams = url.searchParams;

    const latitudes = queryParams.getAll("latitude");
    const longitudes = queryParams.getAll("longitude");
    const startDate = queryParams.get("start_date");
    const endDate = queryParams.get("end_date");
    const hourly = queryParams.getAll("hourly");
    const timezone = queryParams.get("timezone");

    const params = {
      latitude: latitudes.join(","),
      longitude: longitudes.join(","),
      start_date: startDate,
      end_date: endDate,
      hourly: hourly.join(','),
      timezone,
    };

    const response = await fetchOpenMeteoData(
      "https://api.open-meteo.com/v1/forecast",
      params
    );

    return response;
  } catch (error) {
    console.error("Error occurred in /forecast:", error.message);
    return {
      status: 500,
      body: `Error occurred: ${error.message}`,
    };
  }
});

app.get("/history", async (req) => {
  console.log("Route /forecast has been registered.");
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const queryParams = url.searchParams;

    const latitudes = queryParams.getAll("latitude");
    const longitudes = queryParams.getAll("longitude");
    const startDate = queryParams.get("start_date");
    const endDate = queryParams.get("end_date");
    const hourly = queryParams.get("hourly");
    const timezone = queryParams.get("timezone");

    const params = {
      latitude: latitudes.join(","),
      longitude: longitudes.join(","),
      start_date: startDate,
      end_date: endDate,
      hourly,
      timezone,
    };

    const response = await fetchOpenMeteoData(
      "https://archive-api.open-meteo.com/v1/archive",
      params
    );
    
    return JSON.stringify(response);
  } catch (error) {
    console.error("Error occurred in /forecast:", error.message);
    return {
      status: 500,
      body: `Error occurred: ${error.message}`,
    };
  }
});

app.listen(8080, () => {
  console.log("Elysia server is running on http://localhost:8080");
});
