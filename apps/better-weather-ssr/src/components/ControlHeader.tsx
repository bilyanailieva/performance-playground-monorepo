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
import { Toast } from "primereact/toast";
import { WeatherParams, fetchForecastData, fetchHistoricalDataForMultipleCities } from "@/service/OpenMeteoService";
import { NavigatorViews } from "@/constants/NavigatorViews";
import { SelectButton } from "primereact/selectbutton";

export const ControlHeader = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const [val, setVal] = useState(rootStore.selectedLocation?.name ?? "");
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const pathName = usePathname();
  const toast = useRef<Toast>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const intervalOptions = [
    { name: "Auto", value: "auto" },
    { name: "Hourly", value: "hourly" },
    { name: "Daily", value: "daily", disabled: rootStore.currentTimeRangeInDays() < 2 },
    { name: "Monthly", value: "monthly", disabled: rootStore.currentTimeRangeInDays() < 90 }
  ];

  // Ensure styles are applied before rendering
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const existingOption = europeanCapitals.features.find(
      (feature: any) => feature.properties.capital === rootStore.selectedLocation?.name
    );

    if (pathName === NavigatorViews.map) {
      let isoKeys: string[] = [];
      europeanCapitals.features?.forEach((feature: any) => {
        if (feature.properties.latitude && feature.properties.longitude) {
          isoKeys.push(feature.properties.iso_a3);
        }
      });
      rootStore.selectedCities(isoKeys);
      setSelectedLocations(isoKeys);
    } else if (pathName !== NavigatorViews.map && rootStore.selectedLocation?.name && existingOption) {
      rootStore.selectedCities([existingOption.properties.iso_a3]);
      setSelectedLocations([existingOption.properties.iso_a3]);
    }
    handleBtnClick();
  }, [pathName, isLoaded]);

  const handleBtnClick = async () => {
    if (!isLoaded) return;
    const yesterday = moment(new Date()).subtract(1, "days");

    if (rootStore?.headerControls?.endDate < rootStore?.headerControls?.beginDate) {
      toast?.current?.show({ severity: "error", summary: "Error", detail: "Start date should be before end date!" });
    } else if (rootStore.headerControls.endDate >= yesterday && rootStore.headerControls.beginDate >= yesterday) {
      try {
        const data = await fetchForecastData({
          start_date: momentDateToString(rootStore.headerControls.beginDate),
          end_date: momentDateToString(rootStore.headerControls.endDate),
          latitude: rootStore.latutudes,
          longitude: rootStore.longitudes,
          timezone: "auto",
          hourly: [
            WeatherParams.temperature_2m,
            WeatherParams.precipitation,
            WeatherParams.rain,
            WeatherParams.snowfall,
            WeatherParams.weather_code,
            WeatherParams.cloud_cover
          ],
        });
        rootStore?.setApiData(data);
      } catch (e) {
        console.error("Error!", e);
      }
    }
  };

  if (!isLoaded) return <div className="h-16 bg-blue-500 opacity-0"></div>;

  return (
    <div className="min-h-[60px] w-full">
      <Toast ref={toast} />
      <Toolbar className="p-3 bg-blue-500 rounded-none w-full min-h-[60px] flex items-center justify-between"
        left={
          <div className="card flex justify-start">
            {pathName === "/dashboard" ? (
              <div className="p-inputgroup">
                <InputText
                  value={val}
                  onClick={() => setVal("")}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder="Search..."
                  className="h-10 flex-grow p-2 border border-solid border-black rounded-none"
                />
                <Button
                  icon={<IconSearch stroke={2} />}
                  className="p-button-info bg-white border border-solid border-black border-l-0"
                  onClick={handleBtnClick}
                />
              </div>
            ) : (
              <MultiSelect
                value={selectedLocations}
                onChange={(e) => {
                  rootStore.selectedCities(e.value);
                  setSelectedLocations(e.value);
                }}
                options={europeanCapitals.features}
                optionLabel="properties.capital"
                optionValue="properties.iso_a3"
                placeholder="Select Cities"
                maxSelectedLabels={3}
                className="w-full h-10"
              />
            )}
          </div>
        }
        right={
          <div className="flex flex-wrap items-center gap-3">
            <DateBox
              defaultValue={momentDateToString(rootStore.headerControls.beginDate)}
              onChange={(e) => rootStore.setHeaderControls({ beginDate: moment(e.value) })}
            />
            <DateBox
              defaultValue={momentDateToString(rootStore.headerControls.endDate)}
              onChange={(e) => rootStore.setHeaderControls({ endDate: moment(e.value) })}
            />
            <Button className="bg-slate-50 px-2" onClick={handleBtnClick}>
              Refresh
            </Button>
          </div>
        }
      ></Toolbar>
      <Toolbar 
        className="p-3 flex items-center"
        left={
          <span className="font-semibold text-white">Time Interval:</span>
        }
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

export default ControlHeader;
