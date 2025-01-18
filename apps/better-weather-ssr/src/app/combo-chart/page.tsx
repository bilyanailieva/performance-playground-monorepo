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
const DetailsTableLegend = dynamic(
  () => import("@/components/DetailsTableLegend/DetailsTableLegend"),
  { ssr: false }
);
import { generateComboChartData } from "@/utils/DataFormatters";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useContext, useEffect, useMemo, useState } from "react";
import TableLegend from "@/components/TableLegend/TableLegend";
import { rootStoreContext } from "@/components/RootStoreProvider";

const ComboChartPage = observer(() => {
  const rootStore = useContext(rootStoreContext);
  if (!rootStore) {
    console.error("RootStore is not available.");
    return <div>Unable to load data. Please try again later.</div>;
  }
  // const { selectedLocation, headerControls } = rootStore;
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useMemo(() => {
    console.log("ROOTSTORE API DATA", rootStore.apiData);
    if (rootStore?.apiData?.length) {
      const start = performance.now();
      const { weatherData, tableData, colors } = generateComboChartData(
        rootStore.apiData,
        rootStore.openMeteoParams()
      );
      if (!weatherData) {
        throw new Error("Network response was not ok");
      }
      setColors(colors);
      setChartData(weatherData);
      setTableData(tableData);
      const end = performance.now();
      console.log(`${end - start} ms to generate data`);
    } else {
      console.log("HEHEHEHEHEH");
      setColors([]);
      setChartData([]);
      setTableData([]);
    }
    setIsLoading(false);
  }, [rootStore.apiData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  const handleTableUpdate = (selection: any[]) => {
    console.log("selection", selection);
  };

  return (
    <div className="w-full h-full grid gap-4 grid-cols-[50%_1fr] grid-rows-[100%_1fr]">
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="card-left-full"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3 overflow-hidden"
        >
          {/* {rootStore.currentTimeRangeInDays() > 365 ?  */}
          <TableLegend tableData={tableData} cityColors={colors}/>
           {/* : <DetailsTableLegend
            tableData={tableData}
            // cityColors={colors}
            // onSelectionChange={handleTableUpdate}
          />} */}
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <CloudCoverageChart apiData={chartData} cityColors={colors} />
        </div>
      </div>
      <div className="grid gap-4 grid-rows-[50%_1fr]">
        <div
          id="current-weather-card"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <LineChart
            chartData={chartData}
            cityColors={colors}
            // field="minMax"
            viewMode={rootStore.headerControls.viewMode}
          />
        </div>
        <div
          id="card-bottom-right"
          className="rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] relative h-full p-3"
        >
          <BarChart apiData={chartData} cityColors={colors} viewMode={rootStore.headerControls.viewMode}/>
        </div>
      </div>
    </div>
  );
});

export default ComboChartPage;
