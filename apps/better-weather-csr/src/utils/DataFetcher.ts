import { fetchHistoricalDataForMultipleCities } from "@/service/OpenMeteoService";
import { generateComboChartData } from "./DataFormatters";

export async function getData(params: any) {
  // const rootStore = initializeStore();

  try {
    if (Object.keys(params).length) {
      const apiData = await fetchHistoricalDataForMultipleCities(params);
      const { weatherData, tableData, colors } = generateComboChartData(
        apiData,
        params
      );

      return {
        chartData: weatherData,
        tableData: tableData,
        colors: colors,
        error: null,
      };
    } else {
      return {
        chartData: {},
        tableData: [],
        colors: [],
        error: null,
      };
    }
  } catch (error: any) {
    return {
      chartData: {},
      tableData: [],
      colors: [],
      error: error.message || "An error occurred",
    };
  }
}
