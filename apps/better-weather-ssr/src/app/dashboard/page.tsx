"use client";
import DashboardContainerWrapper from "@/components/DashboardContainerWrapper";
import { rootStoreContext } from "@/components/RootStoreProvider";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

const DashboardContainer = observer(() => {
  const rootStore = useContext(rootStoreContext);

  if (!rootStore) {
    console.error("RootStore is not available.");
    return <div>Unable to load data. Please try again later.</div>;
  }

  if (!rootStore.selectedLocation?.location) {
    return <div>Location data is missing. Please select a location.</div>;
  }

  // Pass props to the DashboardContainerWrapper as a React component
  return (
    <DashboardContainerWrapper
      beginDate={rootStore.headerControls.beginDate}
      endDate={rootStore.headerControls.endDate}
      selectedLocation={rootStore.selectedLocation}
    />
  );
});

export default DashboardContainer;
