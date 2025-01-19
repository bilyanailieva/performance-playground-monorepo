
import { lazy, Suspense } from "react";
import DashboardPageServer from "./DashboardPageServer";


export default function DashboardContainerWrapper({
  beginDate,
  endDate,
  selectedLocation,
}: {
  beginDate: any;
  endDate: any;
  selectedLocation: any;
}) {
  if (!beginDate || !endDate || !selectedLocation) {
    return <div>Invalid input. Please ensure all parameters are provided.</div>;
  }

  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      {DashboardPageServer({beginDate, endDate, userLocation: selectedLocation})}
    </Suspense>
  );
}
