import axios from "axios";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import moment from "moment";
import next from "next";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

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
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it outside the function if needed
  }
};

server.get("/history", async (req, res) => {
  try {
    const response = await fetchOpenMeteoData(
      "https://archive-api.open-meteo.com/v1/archive",
      req.query
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json("Error occurred");
  }
});

server.get("/forecast", async (req, res) => {
  try {
    const response = await fetchOpenMeteoData(
      "https://api.open-meteo.com/v1/forecast",
      req.query
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json("Error occurred");
  }
});

app.prepare().then(() => {
  server.all("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const httpServer = createServer(server);

  const PORT = 8080; // Updated port number

  httpServer.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
  });
});

export const GET = app.handle;
export const POST = app.handle;
