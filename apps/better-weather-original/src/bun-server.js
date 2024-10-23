import { cors } from "@elysiajs/cors";
import axios from "axios";
import { Elysia } from "elysia";
import moment from "moment";

const app = new Elysia().use(cors());

app.get("/test", async (req) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const queryParams = url.searchParams;

    // Collect all occurrences of the parameters into arrays
    const latitudes = queryParams.getAll("latitude");
    const longitudes = queryParams.getAll("longitude");
    const startDate = queryParams.get("start_date");
    const endDate = queryParams.get("end_date");
    const hourly = queryParams.get("hourly");
    const timezone = queryParams.get("timezone");

    console.log(latitudes);

    // Assuming fetchOpenMeteoData is a function that takes query parameters and returns a response
    const response = await fetchOpenMeteoData({
      latitude: latitudes.join(","),
      longitude: longitudes.join(","),
      start_date: startDate,
      end_date: endDate,
      hourly,
      timezone,
    });
    return response;
  } catch (e) {
    return {
      status: 500,
      body: `Error occurred: ${e}`,
    };
  }
});

app.listen(8080, () => {
  console.log("Elysia server is running on http://localhost:8080");
});

const fetchOpenMeteoData = async (params) => {
  try {
    const resp = await axios.get(
      "https://archive-api.open-meteo.com/v1/archive",
      { params }
    );
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
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it outside the function if needed
  }
};
