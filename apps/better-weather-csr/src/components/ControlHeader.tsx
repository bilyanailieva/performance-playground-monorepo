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
import { useCallback, useContext, useEffect, useState } from "react";
import { getLocationByName } from "../helper/LocationHelper";
import { DateBox } from "./Calendar";
import { momentDateToString } from "@/utils/FormatDate";

export const ControlHeader = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const [val, setVal] = useState(rootStore.selectedLocation?.name ?? "");
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const pathName = usePathname();

  useEffect(() => {
    const existingOption = europeanCapitals.features.find(
      (feature: any) => feature.properties.capital === rootStore.selectedLocation?.name);
    if (
      rootStore.selectedLocation?.name &&
      existingOption
    ) {
      setSelectedLocations([existingOption.properties.iso_a3])
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

  const handleBtnClick = () => {
    const now = moment(new Date());
    if (
      rootStore?.headerControls?.endDate < rootStore?.headerControls?.beginDate
    ) {
      return;
    } else if (
      rootStore.headerControls.endDate >= now ||
      rootStore.headerControls.endDate >= now
    ) {
      console.log("prepare forecast presentation data here ");
    } else {
      console.log("prepare historical presentation data here ");
    }
  };

  return (
    <div className="card">
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
            <Button onClick={handleBtnClick}>Refresh</Button>
          </div>
        }
      ></Toolbar>
    </div>
  );
});

export default Toolbar;
