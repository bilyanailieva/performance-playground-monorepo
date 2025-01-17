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
import { useCallback, useContext, useEffect, useState } from "react";
import { getLocationByName } from "../helper/LocationHelper";
import { DateBox } from "./Calendar";

export const ControlHeaderSSR = observer(() => {
  const pathName = usePathname();
  const rootStore = useContext(rootStoreContext);
  const [val, setVal] = useState(rootStore.selectedLocation?.name ?? "");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  // Sync local state with selectedCity
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
    console.log(e);
    try {
      const location = await getLocationByName(val);
      if (location) {
        setVal(location.name);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleInputClick = () => {
    setVal("");
  };

  const handleSelection = (e: any) => {
    setSelectedLocations(e.value);
  };

  const handleLoad = useCallback(() => {
    if (selectedLocations.length) {
      const coords = rootStore.selectedCities(selectedLocations);
      params.set("longitude", JSON.stringify(coords.longitude));
      params.set("latitude", JSON.stringify(coords.latitude));
    } else {
      params.delete("longitude");
      params.delete("latitude");
    }

    if (rootStore.headerControls?.beginDate) {
      params.set("beginDate", rootStore.headerControls?.beginDate);
    } else {
      params.delete("beginDate");
    }

    if (rootStore.headerControls?.endDate) {
      params.set("endDate", rootStore.headerControls?.endDate);
    } else {
      params.delete("endDate");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [selectedLocations]);

  return (
    <div className="card">
      <Toolbar
        center={
          <div className="flex flex-wrap align-items-center gap-3">
            <div className="card flex justify-content-center">
              {pathName === "dashboard" ? (
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
              defaultValue={rootStore?.headerControls?.beginDate ?? ""}
              onChange={(e) => onDateChange(e, "beginDate")}
            />
            <DateBox
              defaultValue={rootStore.headerControls?.endDate ?? ""}
              onChange={(e) => onDateChange(e, "endDate")}
            />
            <Button label="Load Data" onClick={handleLoad} />
          </div>
        }
      ></Toolbar>
    </div>
  );
});

export default ControlHeaderSSR;
