import { Suspense } from "react";
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

  const fallbackDash = (
    <div className="min-h-full w-full h-full grid grid-cols-[100%_1fr] grid-rows-[100%_1fr]">
      <div className="w-full h-full grid gap-4 grid-cols-3">
        <div
          id="card-left-full"
          className=" h-full bg-white col-span-2 rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative p-3 overflow-hidden"
        ></div>
        <div
          id="current-weather-card"
          className=" bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        ></div>
        <div className="grid col-span-3 row-span-2">
          <div
            id="card-bottom-right"
            className="overflow-hidden bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
          ></div>
        </div>
      </div>{" "}
    </div>
  );

  return (
    <Suspense fallback={fallbackDash}>
      {DashboardPageServer({
        beginDate,
        endDate,
        userLocation: selectedLocation,
      })}
    </Suspense>
  );
}
