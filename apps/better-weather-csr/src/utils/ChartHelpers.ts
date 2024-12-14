import moment from "moment";

export const chooseInterval = (timeRange: {
  beginDate: string;
  endDate: string;
}) => {
  const startDate = moment(timeRange.beginDate);
  const endDate = moment(timeRange.endDate);
  const monthsBetween = Math.abs(endDate.diff(startDate, "months"));
  if (monthsBetween <= 12) {
    return "daily";
  } else {
    return "monthly";
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
