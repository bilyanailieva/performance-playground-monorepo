// import { useState, useEffect } from 'react';
"use client";
import dynamic from "next/dynamic";
const MapChart = dynamic(() => import("../../components/MapChart"), {
  ssr: false,
});

const MapChartPage = () => {
  // const [initialWeatherData, setInitialWeatherData] = useState(null);
  // const [initialLocations, setInitialLocations] = useState([]);
  // const [initialZ, setInitialZ] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<any>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/test');
  //       const data = await response.json();

  //       // Transform the data as needed
  //       setInitialWeatherData(data);
  //       setInitialLocations(data.map((item: { location: any; }) => item.location));
  //       setInitialZ(data.map((item: { value: any; }) => item.value));
  //     } catch (error) {
  //       console.error('Error fetching weather data:', error);
  //       setError('Failed to load data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  return <MapChart />;
};

export default MapChartPage;
