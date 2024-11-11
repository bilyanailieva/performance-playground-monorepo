import { Feature } from "chartjs-chart-geo";
import { Moment } from "moment";

export type PresentationData = {
  timeRange: {
    beginDate: string;
    endDate: string;
  };
  coords: {
    latitude: number;
    longitude: number;
  };
  time: Moment[];
  temperature2m: number[];
  rain: number[];
  cloudCover: number[];
  entryData: any;
  city?: Feature;
};
