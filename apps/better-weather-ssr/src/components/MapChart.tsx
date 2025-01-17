"use client";

import axios from "axios";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { processWeatherData } from "../helper/MapContainerHelper";
import { europeanCapitals } from "../helper/eu-countries-capitals.geo"; // Replace with the path to your GeoJSON file
import { rootStoreContext } from "@/app/layout";

const MapChart = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const [locations, setLocations] = useState([]);
  const [frames, setFrames] = useState<any>([]);
  const [steps, setSteps] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try{
      if(rootStore.isoCodes.length) {
        const processedData: any = processWeatherData(rootStore.apiData, rootStore.isoCodes);
        setLocations(processedData.locations);
        setFrames(processedData.frames);
        setSteps(processedData.steps);
      }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    
  }, [rootStore.apiData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-grow h-full w-full relative">
      <Plot
        data={[
          {
            type: "choropleth",
            locationmode: "ISO-3",
            locations: locations,
            z: frames[0]?.data[0]?.z,
            colorbar: {
              title: "Value",
              thickness: 10,
            },
            colorscale: "Reds",
            showscale: false,
          },
        ]}
        layout={{
          title: "European capitals mean temperature",
          geo: {
            scope: "europe",
            projection: { type: "mercator" },
            showlakes: true,
            lakecolor: "rgb(255, 255, 255)",
          },
          sliders: [
            {
              active: 0,
              steps: steps,
              x: 0.1,
              len: 0.9,
              xanchor: "left",
              y: 0,
              yanchor: "top",
              pad: { t: 50, b: 10 },
              currentvalue: {
                visible: true,
                prefix: "Day:",
                xanchor: "right",
                font: {
                  size: 20,
                  color: "#666",
                },
              },
              transition: {
                duration: 2,
                easing: "cubic-in-out",
              },
            },
          ],
          updatemenus: [
            {
              x: 0.1,
              y: 0,
              yanchor: "top",
              xanchor: "right",
              showactive: false,
              direction: "left",
              type: "buttons",
              pad: { t: 87, r: 10 },
              buttons: [
                {
                  method: "animate",
                  args: [
                    null,
                    {
                      fromcurrent: true,
                      transition: { duration: 200 },
                      frame: { duration: 500 },
                    },
                  ],
                  label: "Play",
                },
                {
                  method: "animate",
                  args: [
                    [null],
                    {
                      mode: "immediate",
                      transition: { duration: 0 },
                      frame: { duration: 0 },
                    },
                  ],
                  label: "Pause",
                },
              ],
            },
          ],
        }}
        frames={frames}
        style={{ width: "100%", height: "100%", padding: 0 }}
      />
    </div>
  );
});

export default MapChart;
