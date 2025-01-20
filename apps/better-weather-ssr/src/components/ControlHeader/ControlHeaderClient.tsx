"use client";

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
import { momentDateToString } from "@/utils/FormatDate";
import { Toast } from "primereact/toast";
import { WeatherParams, fetchForecastData, fetchHistoricalDataForMultipleCities } from "@/service/OpenMeteoService";
import { NavigatorViews } from "@/constants/NavigatorViews";
import { SelectButton } from "primereact/selectbutton";
import { rootStoreContext } from "../RootStoreProvider";
import { DateBox } from "../Calendar";

export const ControlHeaderClient = observer(() => {
  const rootStore = useContext(rootStoreContext);

  if (!rootStore) {
    console.error("RootStore is not available.");
    return <div>Unable to load data. Please try again later.</div>;
  }
  const [val, setVal] = useState(rootStore.selectedLocation?.name ?? "");
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  // const [interval, setInterval] = useState(preloadedData.defaultInterval);
  // const [beginDate, setBeginDate] = useState(preloadedData.beginDate);
  // const [endDate, setEndDate] = useState(preloadedData.endDate);
  const pathName = usePathname();
  const toast = useRef<Toast>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setVal(rootStore.selectedLocation?.name ?? '')
  }, [rootStore.selectedLocation])

  const intervalOptions = [
    { name: "Auto", value: "auto" },
    { name: "Hourly", value: "hourly" },
    { name: "Daily", value: "daily", disabled: rootStore.currentTimeRangeInDays() < 2 },
    { name: "Monthly", value: "monthly", disabled: rootStore.currentTimeRangeInDays() < 90 }
  ];

  // // Ensure styles are applied before rendering
  // useEffect(() => {
  //   setIsLoaded(true);
  // }, []);

  useEffect(() => {

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
    // rootStore.setApiData(fetchedData);
    // rootStore.setHeaderControls({beginDate: moment(preloadedData.beginDate), endDate: moment(preloadedData.endDate), viewMode: preloadedData.interval});
  }, [pathName]);

  const handleBtnClick = async () => {
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
    } else {
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

  // if (!isLoaded) return <div className="h-16 bg-blue-500 opacity-0"></div>;

  return (
    <div className="min-w-full w-full">
  {/* Reserve space for Toast */}
  {/* <div className="min-h-[60px]"> */}
    <Toast ref={toast} />
  {/* </div> */}

  {/* Main Toolbar */}
  <Toolbar
    className="p-3 bg-blue-500 rounded-none w-full min-h-[60px] flex items-center justify-between"
    left={
      <div className="card flex justify-start">
        {pathName === "/dashboard" ? (
          <div className="p-inputgroup">
            {/* InputText with reserved dimensions */}
            <InputText
              value={val}
              onClick={() => setVal("")}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Search..."
              className="h-10 flex-grow p-2 border border-solid border-black rounded-none"
              style={{ minWidth: "150px" }}
            />
            {/* Button with fixed dimensions */}
            <Button
              icon={<IconSearch stroke={2} />}
              className="p-button-info bg-white border border-solid border-black border-l-0"
              onClick={handleBtnClick}
              style={{ width: "40px", height: "40px" }}
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
            style={{ minWidth: "200px" }}
          />
        )}
      </div>
    }
    right={
      <div className="flex flex-wrap items-center gap-3">
        {/* DateBox Components with reserved space */}
        <DateBox
          defaultValue={momentDateToString(rootStore.headerControls.beginDate)}
          onChange={(e) => rootStore.setHeaderControls({ beginDate: moment(e.value) })}
          style={{ width: "150px", height: "40px" }}
        />
        <DateBox
          defaultValue={momentDateToString(rootStore.headerControls.endDate)}
          onChange={(e) => rootStore.setHeaderControls({ endDate: moment(e.value) })}
          style={{ width: "150px", height: "40px" }}
        />
        {/* Refresh Button with reserved dimensions */}
        <Button
          className="bg-slate-50 px-2"
          onClick={handleBtnClick}
          style={{ width: "80px", height: "40px" }}
        >
          Refresh
        </Button>
      </div>
    }
  />

  {/* Secondary Toolbar */}
  <Toolbar
    className="p-3 flex items-center justify-between h-[60px] min-h-[70px] min-w-full"
    left={
      <span className="font-semibold text-blue">Time Interval:</span>
    }
    right={
      <SelectButton
        value={rootStore.headerControls.viewMode}
        onChange={(e) => rootStore.setHeaderControls({ viewMode: e.value })}
        optionLabel="name"
        options={intervalOptions}
        className="flex justify-self-end"
      />
    }
  />
</div>

  );
});

export default ControlHeaderClient;
