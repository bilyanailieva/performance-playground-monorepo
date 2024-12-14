import moment from "moment";

export const getTimestepsByTimeRange = (
  timeRange: {
    beginDate: string;
    endDate: string;
  },
  interval: "monthly" | "daily" | 'hourly' | 'auto'
) => {
  const startDate = moment(timeRange.beginDate);
  const endDate = moment(timeRange.endDate);

  const timestepArray = [];
  const current = startDate.clone();

  while (current.isBefore(endDate)) {
    if (interval === "monthly") {
      timestepArray.push(current.format("MMM-yy"));
      current.add(1, "month");
    } else if (interval === "daily") {
      timestepArray.push(current.format("DD-MM-yy"));
      current.add(1, "day");
    } else if (interval === "hourly") {
      timestepArray.push(current.format("lll"));
      current.add(1, "hour");
    }
  }

  return timestepArray;
};
