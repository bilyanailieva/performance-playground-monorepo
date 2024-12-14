"use client";
import { rootStoreContext } from "@/app/layout";
import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { IconSearch } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { usePathname } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { getLocationByName } from "../helper/LocationHelper";
import { DateBox } from "./Calendar";
import { momentDateToString } from "@/utils/FormatDate";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";
import {
  WeatherParams,
  fetchForecastData,
  fetchHistoricalDataForMultipleCities,
} from "@/service/OpenMeteoService";
import { NavigatorViews } from "@/constants/NavigatorViews";
import { SelectButton } from "primereact/selectbutton";


export const ControlHeader = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const [val, setVal] = useState(rootStore.selectedLocation?.name ?? "");
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const pathName = usePathname();
  const toast = useRef<Toast>(null);

  const intervalOptions = [
    {
      name: "Auto",
      value: "auto",
    },
    {
      name: "Hourly",
      value: "hourly",
    },
    {
      name: "Daily",
      value: "daily",
      disabled: rootStore.currentTimeRangeInDays() < 2
    },
    {
      name: "Monthly",
      value: "montly",
      disabled: rootStore.currentTimeRangeInDays() < 90
    },
  ];

  useEffect(() => {
    const existingOption = europeanCapitals.features.find(
      (feature: any) =>
        feature.properties.capital === rootStore.selectedLocation?.name
    );
    if (pathName === NavigatorViews.map) {
      let lats = [];
      let isoKeys: string[] = [];
      europeanCapitals.features?.forEach((feature: any, index) => {
        if (feature.properties.latitude && feature.properties.longitude) {
          isoKeys.push(feature.properties.iso_a3);
        }
      });
      rootStore.selectedCities(isoKeys);
      setSelectedLocations(isoKeys);
    } else if (
      pathName !== NavigatorViews.map &&
      rootStore.selectedLocation?.name &&
      existingOption
    ) {
      rootStore.selectedCities([existingOption.properties.iso_a3]);
      setSelectedLocations([existingOption.properties.iso_a3]);
    }
    handleBtnClick();
  }, [pathName]);

  useEffect(() => {
    setVal(rootStore.selectedLocation?.name ?? "");
  }, [rootStore.selectedLocation?.name]);

  const onDateChange = (e: any, field: "beginDate" | "endDate") => {
    rootStore.setHeaderControls({ [field]: moment(e.value) });
  };

  const onInputChange = (e: any) => {
    const newValue = e.target.value;
    setVal(newValue);
  };

  const handleInputClick = () => {
    setVal("");
  };

  const handleSearch = async (e: any) => {
    try {
      const location = await getLocationByName(val);
      if (location) {
        setVal(location.name);
        rootStore.setLocation(location);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleSelection = useCallback((e: any) => {
    rootStore.selectedCities(e.value);
    setSelectedLocations(e.value);
  }, []);

  const handleBtnClick = async () => {
    const yesterday = moment(new Date()).subtract(1, "days");

    if (
      rootStore?.headerControls?.endDate < rootStore?.headerControls?.beginDate
    ) {
      if (!toast.current) return;
      toast?.current.show({
        severity: "error",
        summary: "Error",
        detail: "Start date should be before end date!",
      });
    } else if (
      rootStore.headerControls.endDate >= yesterday &&
      rootStore.headerControls.beginDate >= yesterday
    ) {
      console.log("prepare forecast presentation data here ");
      try {
        const data = await fetchForecastData({
          start_date: momentDateToString(rootStore.headerControls.beginDate),
          end_date: momentDateToString(rootStore.headerControls.endDate),
          latitude: rootStore.latutudes,
          longitude: rootStore.longitudes,
          timezone: rootStore.selectedLocation?.location?.timezone ?? "auto",
          hourly: [
            WeatherParams.temperature_2m,
            WeatherParams.precipitation,
            WeatherParams.rain,
            WeatherParams.snowfall,
            WeatherParams.weather_code,
            WeatherParams.cloud_cover,
          ],
        });
        rootStore.setApiData(data);
      } catch (e) {
        console.error("Error!", e);
      }
    } else {
      console.log("prepare historical presentation data here ");
      try {
        const data = await fetchHistoricalDataForMultipleCities({
          start_date: momentDateToString(rootStore.headerControls.beginDate),
          end_date: momentDateToString(rootStore.headerControls.endDate),
          latitude: rootStore.latutudes,
          longitude: rootStore.longitudes,
          timezone: rootStore.selectedLocation?.location?.timezone ?? "auto",
          hourly: [
            WeatherParams.temperature_2m,
            WeatherParams.precipitation,
            WeatherParams.rain,
            WeatherParams.snowfall,
            WeatherParams.weather_code,
            WeatherParams.cloud_cover,
          ],
        });
        rootStore.setApiData(data);
      } catch (e) {
        console.error("Error!", e);
      }
    }
  };

  return (
    <div className="">
      <Toast ref={toast} />
      <Toolbar className="p-3 bg-blue-500 rounded-none"
        left={
          <div className="card flex justify-content-center">
            {pathName === "/dashboard" ? (
              <div className="p-inputgroup">
                <InputText
                  value={val}
                  onClick={handleInputClick}
                  onChange={onInputChange}
                  placeholder="Search..."
                  className="h-full flex grow p-2 border border-solid border-black rounded-none"
                />
                <Button
                  icon={<IconSearch stroke={2} />}
                  className="p-button-info bg-white border border-solid border-black border-l-0"
                  onClick={handleSearch}
                />
              </div>
            ) : (
              <MultiSelect
                value={selectedLocations}
                onChange={handleSelection}
                options={europeanCapitals.features}
                optionLabel="properties.capital"
                optionValue="properties.iso_a3"
                placeholder="Select Cities"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
              />
            )}
          </div>
        }
        // center={

        // }
        right={
          <div className="flex flex-wrap align-items-center gap-3">
            <DateBox
              defaultValue={momentDateToString(
                rootStore.headerControls.beginDate
              )}
              onChange={(e) => onDateChange(e, "beginDate")}
            />
            <DateBox
              defaultValue={momentDateToString(
                rootStore.headerControls.endDate
              )}
              onChange={(e) => onDateChange(e, "endDate")}
            />
            <div className="flex items-center gap-4"></div>{" "}
            <Button className={'bg-slate-50 px-2'}onClick={handleBtnClick}>Refresh</Button>
          </div>
        }
      ></Toolbar>
      <Toolbar
      className="p-3"
        right={
          <SelectButton
            value={rootStore.headerControls.viewMode}
            onChange={(e) => rootStore.setHeaderControls({ viewMode: e.value })}
            optionLabel="name"
            options={intervalOptions}
          />
        }
      ></Toolbar>
    </div>
  );
});

export default Toolbar;
