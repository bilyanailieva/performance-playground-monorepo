import moment from "moment";

export const getTimestepsByTimeRange = (
  timeRange: {
    beginDate: string;
    endDate: string;
  },
  interval: "month" | "day"
) => {
  const startDate = moment(timeRange.beginDate);
  const endDate = moment(timeRange.endDate);

  const timestepArray = [];
  const current = startDate.clone();

  while (current.isBefore(endDate)) {
    if (interval === "month") {
      timestepArray.push(current.format("MMM-yy"));
      current.add(1, "month");
    } else if (interval === "day") {
      timestepArray.push(current.format("DD-MM-yy"));
      current.add(1, "day");
    }
  }

  return timestepArray;
};
