"use client";
import { rootStoreContext } from "@/app/layout";
import { europeanCapitals } from "@/helper/eu-countries-capitals.geo";
import { IconSearch } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import { useContext, useEffect, useState } from "react";
import { getLocationByName } from "../helper/LocationHelper";
import { DateBox } from "./Calendar";

export const ControlHeader = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const [val, setVal] = useState(rootStore.selectedLocation?.name ?? "");
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const [options, setOptions] = useState(europeanCapitals.features);

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  // useEffect(() => {
  //   if (rootStore.activeTab !== "dashboard") {
  //     rootStore.setHeaderControls({
  //       beginDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
  //       endDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
  //     });
  //   } else {
  //     rootStore.setHeaderControls({
  //       endDate: moment().add(7, "days").format("YYYY-MM-DD"),
  //       beginDate: moment().startOf("day").format("YYYY-MM-DD"),
  //     });
  //   }
  //   console.log(selectedLocations, rootStore.selectedLocation);
  //   if (!selectedLocations.length && rootStore.selectedLocation) {
  //     const location = rootStore.selectedLocation;
  //     const info = {
  //       properties: {
  //         iso_a3: "myLocation",
  //         latitude: rootStore.selectedLocation.location?.latitude,
  //         longitude: rootStore.selectedLocation.location?.longitute,
  //         capital: rootStore.selectedLocation.name,
  //         timezone: rootStore.selectedLocation.location?.timezone,
  //       },
  //     };
  //     setOptions([info as Feature, ...europeanCapitals.features]);
  //     setSelectedLocations([info.properties.iso_a3]);
  //     rootStore.setSelectedCitiesInfo({
  //       iso_a3: location.id?.toString() ?? useId(),
  //       latitude: location.location?.latitude,
  //       longitude: location.location?.longitute,
  //       capital: location.name,
  //       timezone: location.location?.timezone,
  //     });
  //     console.log("here");
  //   }
  // }, [rootStore.activeTab]);

  useEffect(() => {
    setVal(rootStore.selectedLocation?.name ?? "");
  }, [rootStore.selectedLocation?.name]);

  const onDateChange = (e: any, field: "beginDate" | "endDate") => {
    const formattedDate = moment(e.value).format("YYYY-MM-DD");
    rootStore.setHeaderControls({ [field]: formattedDate });
  };

  const onInputChange = (e: any) => {
    const newValue = e.target.value;
    setVal(newValue);
  };

  const handleSearch = async (e: any) => {
    try {
      const location = await getLocationByName(val);
      console.log(location);
      if (location) {
        setVal(location.name);
        rootStore.setLocation(location);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleInputClick = () => {
    setVal("");
  };

  const handleSelection = (e: any) => {
    console.log(e);
    const shouldUpdate =
      e.value.length > rootStore.selectedCitiesInfo.length ||
      e.value.some(
        (element: {
          iso_a3: string;
          latitude?: number | undefined;
          longitude?: number | undefined;
          capital?: string | undefined;
          timezone?: string | undefined;
        }) =>
          rootStore.selectedCitiesInfo.find(
            (el) => el.iso_a3 === element.iso_a3
          )
      );
    rootStore.selectedCities(e.value);
    setSelectedLocations(e.value);
    console.log(shouldUpdate);
    rootStore.setFrontendData(rootStore.activeTab, shouldUpdate);
  };

  return (
    <div className="card">
      <Toolbar
        center={
          <div className="flex flex-wrap align-items-center gap-3">
            <div className="card flex justify-content-center">
              {pathName === "/" ? (
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
                  options={options}
                  optionLabel="properties.capital"
                  optionValue="properties.iso_a3"
                  placeholder="Select Cities"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                />
              )}
            </div>
            <DateBox
              defaultValue={rootStore?.headerControls?.beginDate ?? ""}
              onChange={(e) => onDateChange(e, "beginDate")}
            />
            <DateBox
              defaultValue={rootStore.headerControls?.endDate ?? ""}
              onChange={(e) => onDateChange(e, "endDate")}
            />
            <Button
              onClick={() => rootStore.setFrontendData(rootStore.activeTab)}
            >
              Refresh
            </Button>
          </div>
        }
      ></Toolbar>
    </div>
  );
});

export default Toolbar;
