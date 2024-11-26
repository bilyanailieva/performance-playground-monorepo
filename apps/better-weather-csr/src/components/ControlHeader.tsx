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
import { WeatherParams, fetchForecastData, fetchHistoricalDataForMultipleCities } from "@/service/OpenMeteoService";

export const ControlHeader = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const [val, setVal] = useState(rootStore.selectedLocation?.name ?? "");
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const pathName = usePathname();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const existingOption = europeanCapitals.features.find(
      (feature: any) =>
        feature.properties.capital === rootStore.selectedLocation?.name
    );
    if (rootStore.selectedLocation?.name && existingOption) {
      setSelectedLocations([existingOption.properties.iso_a3]);
    }
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
    const now = moment(new Date());
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
      rootStore.headerControls.endDate >= now ||
      rootStore.headerControls.endDate >= now
    ) {
      console.log("prepare forecast presentation data here ");
      try {
      const data = await fetchForecastData({
        start_date: momentDateToString(rootStore.headerControls.beginDate),
        end_date: momentDateToString(rootStore.headerControls.endDate),
        latitude: rootStore.latutudes,
        longitude: rootStore.longitudes,
        timezone: rootStore.selectedLocation?.location?.timezone ?? 'auto',
        hourly: [
          WeatherParams.temperature_2m,
          WeatherParams.precipitation,
          WeatherParams.rain,
          WeatherParams.snowfall,
          WeatherParams.weather_code,
          WeatherParams.cloud_cover,
        ]
      });
      rootStore.setApiData(data);
    } catch (e) {
      console.error('Error!', e);
    }
    } else {
      console.log("prepare historical presentation data here ");
      try {
        const data = await fetchHistoricalDataForMultipleCities({
          start_date: momentDateToString(rootStore.headerControls.beginDate),
          end_date: momentDateToString(rootStore.headerControls.endDate),
          latitude: rootStore.latutudes,
          longitude: rootStore.longitudes,
          timezone: rootStore.selectedLocation?.location?.timezone ?? 'auto',
          hourly: [
            WeatherParams.temperature_2m,
            WeatherParams.precipitation,
            WeatherParams.rain,
            WeatherParams.snowfall,
            WeatherParams.weather_code,
            WeatherParams.cloud_cover,
          ]
        });
        rootStore.setApiData(data);
      } catch (e) {
        console.error('Error!', e);
      }
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <Toolbar
        center={
          <div className="flex flex-wrap align-items-center gap-3">
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
                    className="p-button-info border border-solid border-black border-l-0"
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
            <div className="flex items-center gap-4">
              {/* Left Label */}
              <label
                className={`text-sm ${rootStore.headerControls.viewMode === "hourly" ? "font-bold text-blue-600" : "text-gray-500"}`}
              >
                Hourly
              </label>
              {/* Switch */}
              <InputSwitch
                checked={!!(rootStore.headerControls.viewMode === "daily")}
                // trueValue={"daily"}
                // falseValue={"hourly"}
                onChange={(e) => {
                  console.log(e);
                  const viewMode = e.value ? "daily" : "hourly";
                  rootStore.setHeaderControls({
                    viewMode,
                  });
                }}
                className="relative block outline-none focus:ring-2 focus:ring-blue-400"
              />
              {/* Right Label */}
              <label
                className={`text-sm ${rootStore.headerControls.viewMode === "daily" ? "font-bold text-blue-600" : "text-gray-500"}`}
              >
                Daily
              </label>
            </div>{" "}
            <Button onClick={handleBtnClick}>Refresh</Button>
          </div>
        }
      ></Toolbar>
    </div>
  );
});

export default Toolbar;
