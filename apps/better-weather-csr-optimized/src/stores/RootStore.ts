"use client";

import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { WeatherParams } from "@/models/OpenMeteo";
import { PresentationData } from "@/models/PresentationData";
import { TableDataEntry } from "@/models/TableData";
import {
  fetchForecastData,
  fetchHistoricalDataForMultipleCities,
} from "@/service/OpenMeteoService";
import { generateComboChartData } from "@/utils/DataFormatters";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import { NavigatorView, NavigatorViews } from "../constants/NavigatorViews";
import { fetchCity } from "../helper/LocationHelper";

type ControlHeaderSettings = {
  beginDate?: string;
  endDate?: string;
};

export type UserLocation = {
  name?: string;
  id?: number;
  location?: { longitute: number; latitude: number; timezone: string };
};

export default class RootStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private defaultBegin = moment(new Date()).format("YYYY-MM-DD");
  private defaultEnd = moment(new Date()).add(7, "days").format("YYYY-MM-DD");
  private _activeTab: NavigatorView = NavigatorViews.dashboard;
  private _controlHeaderState: ControlHeaderSettings | undefined = {
    beginDate: this.defaultBegin,
    endDate: this.defaultEnd,
  };
  private _selectedLocation: UserLocation | undefined = undefined;

  setActiveTab(tab: NavigatorView) {
    this._activeTab = tab;
  }

  get activeTab() {
    return this._activeTab;
  }

  setHeaderControls(updates: Partial<ControlHeaderSettings>) {
    this._controlHeaderState = {
      ...this._controlHeaderState,
      ...updates,
    };
  }

  get headerControls() {
    return this._controlHeaderState;
  }

  setLocation(updates: Partial<UserLocation>) {
    console.log(updates);
    this._selectedLocation = {
      ...this._selectedLocation,
      ...updates,
    };
  }

  get selectedLocation() {
    return this._selectedLocation;
  }

  userLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const userTimezone =
              Intl.DateTimeFormat().resolvedOptions().timeZone;
            const { latitude, longitude } = position.coords;
            const city = await fetchCity(latitude, longitude);
            this._selectedLocation = {
              name: city.display_name,
              id: city.osm_id,
              location: {
                longitute: longitude,
                latitude,
                timezone: userTimezone,
              },
            };
            return this._selectedLocation;
          } catch (error) {
            console.error("Error fetching city", error);
          }
        },
        (error) => {
          console.error("Error fetching geolocation", error);
        }
      );
    }
    return undefined;
  }

  private _selectedCitiesInfo: CityInfo[] = [];
  private _selectedLongitudes: number[] = [];
  private _selectedLatitudes: number[] = [];

  get selectedCitiesInfo() {
    return this._selectedCitiesInfo;
  }

  get latutudes() {
    return this._selectedLatitudes;
  }

  get longitudes() {
    return this._selectedLongitudes;
  }

  selectedCities = (cityCodes: string[]) => {
    const selectedCities: CityInfo[] = [];
    const longitudes: number[] = [];
    const latutudes: number[] = [];
    europeanCapitals.features
      .filter((city) => cityCodes.includes(city.properties.iso_a3))
      .forEach((item) => {
        selectedCities.push({
          iso_a3: item.properties.iso_a3,
          latitude: item.properties.latitude,
          longitude: item.properties.longitude,
          capital: item.properties.capital,
          timezone: item.properties.timezone,
        });
        if (item.properties.longitude && item.properties.latitude) {
          longitudes.push(item.properties.longitude);
          latutudes.push(item.properties.latitude);
        }
      });
    console.log(selectedCities);
    this._selectedCitiesInfo = selectedCities;
    this._selectedLatitudes = latutudes;
    this._selectedLongitudes = longitudes;

    return { longitude: longitudes, latitude: latutudes };
  };

  setSelectedCitiesInfo = (info: CityInfo) => {
    this._selectedCitiesInfo = [info];
    if (info.latitude && info.longitude) {
      this._selectedLatitudes = [info.latitude];
      this._selectedLongitudes = [info.longitude];
    }
  };

  openMeteoParams = () => {
    if (
      this.headerControls?.endDate &&
      this.headerControls?.beginDate &&
      this.headerControls?.endDate >= this.headerControls?.beginDate
    ) {
      return {
        latitude: this._selectedLatitudes,
        longitude: this._selectedLongitudes,
        start_date: this.headerControls?.beginDate,
        end_date: this.headerControls?.endDate,
        hourly: [
          WeatherParams.temperature_2m,
          WeatherParams.precipitation,
          WeatherParams.rain,
          WeatherParams.snowfall,
          WeatherParams.weather_code,
          WeatherParams.cloud_cover,
        ],
        daily: [
          WeatherParams.temperature_2m_mean,
          WeatherParams.precipitation_sum,
        ],
        timezone: "auto",
      };
    }
    return {};
  };

  private _chartColors: string[] = [];
  private _presentationData: PresentationData[] = [];
  private _tableRepresentation: TableDataEntry[] = [];
  private _errorMessage: any = "";
  private _isLoadingOverlayVisible = true;

  get chartColors() {
    return this._chartColors;
  }

  get presentationData() {
    return this._presentationData;
  }
  get tableRepresentation() {
    return this._tableRepresentation;
  }
  get errorMessage() {
    return this._errorMessage;
  }
  get isLoadingOverlayVisible() {
    return this._isLoadingOverlayVisible;
  }

  setIsLoadingSpinnerVisible(visibility: boolean) {
    this._isLoadingOverlayVisible = visibility;
  }

  private _timesteps: string[] = [];
  get timesteps() {
    return this._timesteps;
  }

  setFrontendData = async (
    tab: NavigatorView,
    shouldRefetch: boolean = true,
    forecast: boolean = false
  ) => {
    this._isLoadingOverlayVisible = true;
    if (tab === "combo-chart" && shouldRefetch) {
      const start = performance.now();
      try {
        let apiData;
        const forecast =
          this.openMeteoParams()?.end_date &&
          moment(this.openMeteoParams()?.end_date) >= moment().startOf("day");
        if (forecast) {
          apiData = await fetchForecastData(this.openMeteoParams());
        } else {
          apiData = await fetchHistoricalDataForMultipleCities(
            this.openMeteoParams()
          );
        }
        const { weatherData, tableData, colors, timesteps } =
          generateComboChartData(apiData, this.openMeteoParams());
        console.log(tableData);
        if (!weatherData) {
          throw new Error("Network response was not ok");
        }
        this._chartColors = colors;
        this._presentationData = weatherData;
        this._tableRepresentation = tableData;
        this._timesteps = timesteps;
      } catch (error: any) {
        this._errorMessage = error;
      } finally {
        const end = performance.now();
        console.log(`Data fetching took ${end - start} ms`);
      }
    } else {
      this._presentationData = this.presentationData.filter(
        (entry) =>
          this._selectedLatitudes.includes(entry.coords.latitude) &&
          this._selectedLongitudes.includes(entry.coords.longitude)
      );
    }
    this._isLoadingOverlayVisible = false;
  };
}

type CityInfo = {
  iso_a3: string;
  latitude?: number;
  longitude?: number;
  capital?: string;
  timezone?: string;
};
