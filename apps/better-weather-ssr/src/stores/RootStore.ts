"use client";

import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { WeatherParams } from "@/models/OpenMeteo";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import { NavigatorViewValues, NavigatorViews } from "../constants/NavigatorViews";
import { fetchCity } from "../helper/LocationHelper";

type ControlHeaderSettings = {
  beginDate: moment.Moment;
  endDate: moment.Moment;
  viewMode: 'daily' | 'hourly' | 'monthly' | 'auto'
};

export type UserLocation = {
  name: string;
  id: number;
  country: string;
  location: { longitute: number; latitude: number; timezone: string };
};

export default class RootStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private defaultBegin = moment(new Date());
  private defaultEnd = moment(new Date()).add(7, "days");
  private _activeTab: NavigatorViewValues = NavigatorViews.dashboard;
  private _controlHeaderState: ControlHeaderSettings = {
    beginDate: this.defaultBegin,
    endDate: this.defaultEnd,
    viewMode: 'auto'
  };
  private _selectedLocation: UserLocation | undefined = undefined;

  setActiveTab(tab: NavigatorViewValues) {
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

  setLocation(updates: UserLocation) {
    this._selectedLocation = {
      ...this._selectedLocation,
      ...updates,
    };
    const existingOption = europeanCapitals.features.find(
      (feature: any) =>
        feature.properties.country === updates?.country
    );
    if(existingOption) {
      this._selectedCitiesInfo = [{iso_a3: existingOption.properties.iso_a3, ...updates.location, capital: existingOption.properties.capital }];
    }
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
              country: city.iso_a3,
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
    this._isoCodes = cityCodes;
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
    this._selectedCitiesInfo = selectedCities;
    this._selectedLatitudes = latutudes;
    this._selectedLongitudes = longitudes;

    return { longitude: longitudes, latitude: latutudes };
  };

  private _isoCodes: string[] = [];
  get isoCodes(){
    return this._isoCodes;
  }

  setSelectedCitiesInfo = (info: CityInfo) => {
    this._selectedCitiesInfo = [info];
    if (info.latitude && info.longitude) {
      this._selectedLatitudes = [info.latitude];
      this._selectedLongitudes = [info.longitude];
    }
  };

  openMeteoParams = () => {
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
  };

  private _apiData: any = [];

  get apiData() {
    return this._apiData;
  }

  public setApiData(data: any) {
    this._apiData = data;
  }

  public currentTimeRangeInDays() {
    return this._controlHeaderState.endDate.diff(this._controlHeaderState.beginDate, 'days');
  }
}

export type CityInfo = {
  iso_a3: string;
  latitude?: number;
  longitude?: number;
  capital?: string;
  timezone?: string;
};


