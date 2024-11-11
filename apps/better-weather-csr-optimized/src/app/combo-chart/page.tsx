"use client";
const BarChart = dynamic(() => import("@/components/BarChart"), { ssr: false });
const LineChart = dynamic(
  () => import("@/components/TemperatureChart/LineChart"),
  { ssr: false }
);
const CloudCoverageChart = dynamic(
  () => import("@/components/CloudCoverageChart/CloudCoverageChart"),
  { ssr: false }
);
const TableLegend = dynamic(
  () => import("@/components/TableLegend/TableLegend"),
  { ssr: false }
);
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { Suspense, useContext } from "react";
import { rootStoreContext } from "../layout";

const ComboChartPage = observer(() => {
  const rootStore = useContext(rootStoreContext);

  if (rootStore.errorMessage) {
    return <div>Error: {rootStore.errorMessage.message}</div>;
  }

  return (
    <div className="w-full h-full grid gap-4 grid-cols-[50%_1fr] grid-rows-[100%_1fr]">
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="card-left-full"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3 overflow-hidden"
        >
          <Suspense fallback={<></>}>
            {rootStore.tableRepresentation.length ? (
              <TableLegend store={rootStore} />
            ) : (
              <></>
            )}
          </Suspense>
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <Suspense fallback={<></>}>
            {rootStore.presentationData.length ? (
              <CloudCoverageChart store={rootStore} />
            ) : (
              <></>
            )}
          </Suspense>
        </div>
      </div>
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="current-weather-card"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <Suspense fallback={<></>}>
            {rootStore.presentationData.length ? (
              <LineChart store={rootStore} />
            ) : (
              <></>
            )}
          </Suspense>
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <Suspense fallback={<></>}>
            {rootStore.presentationData.length ? (
              <BarChart store={rootStore} />
            ) : (
              <></>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
});

export default ComboChartPage;
