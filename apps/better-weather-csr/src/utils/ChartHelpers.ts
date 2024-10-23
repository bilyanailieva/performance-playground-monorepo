import moment from "moment";

export const chooseInterval = (timeRange: {
  beginDate: string;
  endDate: string;
}): { interval: "day" | "month"; format: string } => {
  const startDate = moment(timeRange.beginDate);
  const endDate = moment(timeRange.endDate);
  const monthsBetween = Math.abs(endDate.diff(startDate, "months"));
  console.log(monthsBetween);
  if (monthsBetween < 1) {
    return { interval: "day", format: "DD-MM-YYYY" };
  } else {
    return { interval: "month", format: "MMM-YYY" };
  }
};

export const chooseColor = (entry: any) => {
  const meanFinal: number = calculateMean(entry) ?? -1;
  if (meanFinal <= 0) {
    return "blue";
  } else if (meanFinal > 0 && meanFinal <= 5) {
    return "green";
  } else if (meanFinal > 5 && meanFinal <= 24) {
    return "yellow";
  } else if (meanFinal > 24 && meanFinal <= 32) {
    return "orange";
  } else if (meanFinal > 32) {
    return "red";
  } else {
    return "black";
  }
};

export const calculateSum = (data: any[]) => {
  if (!data || !data.length) return 0;
  return data
    .filter((item) => typeof item === "number") // Filter out non-numeric values
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

export function calculateMean(values: number[]) {
  let total = 0;
  let count = 0;
  if (!values || !values.length) return NaN;

  values.forEach((value) => {
    total += value;
    count += 1;
  });

  if (count === 0) {
    return null; // Avoid division by zero if the array is empty
  }
  return total / count;
}

// export const getDailyDataForFields = (apiData: any, fields: string[]) => {
//   const timesteps = getTimestepsByTimeRange(apiData[0].timeRange, "day");
//   const entryDataArray: any[] = [];
//   apiData.forEach((cityInfo: any, index: number) => {
//     const entryData: any = {};
//     cityInfo.time.forEach((timestamp: Moment, index: number) => {
//       const month = moment(timestamp).format("DD-MM-yy");
//       if (!entryData[month]) {
//         entryData[month] = [];
//       }
//       for (let i = 0; i < fields.length; i++) {
//         const field = fields[i];
//         if (cityInfo[field]) {
//           const value = cityInfo[field][index];
//           if (!entryData[month][field]) {
//             entryData[month][field] = [];
//           }
//           if (!isNaN(value)) {
//             entryData[month][field].push(value);
//           }
//         }
//       }
//     });
//     entryDataArray.push(entryData);
//   });
//   return { dataArray: entryDataArray, timesteps };
// };
