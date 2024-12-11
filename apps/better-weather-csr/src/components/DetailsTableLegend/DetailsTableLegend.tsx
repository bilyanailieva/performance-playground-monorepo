"use client";

export type NestedRow = {
  metric: string;
  [city: string]: number | string | undefined; // Metric values for each city
};

export type NestedTableData = {
  datetime: string;
  metrics: NestedRow[]; // Nested data for each datetime
};
import React, { useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  momentDateToDateTimeString,
  momentDateToString,
} from "@/utils/FormatDate";
import moment from "moment";


const DetailsTableLegend = ({
  tableData,
}: {
  tableData: NestedTableData[];
}) => {
  const [expandedRows, setExpandedRows] = useState<any>(null);

  const [cityColumns, setCityColumns] = useState<string[]>([]);

  useMemo(() => {
    const cols =
      tableData?.[0]?.metrics.length > 0
        ? Object.keys(tableData[0].metrics[0]).filter((key) => key !== "metric")
        : [];
    setCityColumns(cols);
  }, [tableData]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <DataTable
        size={"small"}
        stripedRows
        scrollable
        scrollHeight={"300px"}
        virtualScrollerOptions={{ itemSize: 46 }}
        expandedRows={expandedRows}
        onRowToggle={(e: any) => setExpandedRows(e.data)}
        value={tableData}
        rowExpansionTemplate={(rowData) =>
          nestedTable(rowData.metrics, cityColumns)
        }
      >
        {/* Main table columns */}
        <Column
          field="datetime"
          header="Datetime"
          body={(entry) => {
            console.log(entry);
            return momentDateToDateTimeString(moment(entry.datetime));
          }}
        />
        {/* {cityColumns.map((city) => (
          <Column key={city} field={city} header={city} />
        ))} */}
        <Column expander style={{ width: "3em" }} />
      </DataTable>
    </div>
  );
};

function nestedTable(metrics: NestedRow[], cityColumns: any[]) {
  return (
    <DataTable value={metrics}>
      {/* Row headers for metrics */}
      <Column field="metric" header="Metric" />
      {/* Dynamic city columns */}
      {cityColumns.map((city) => (
        <Column key={city} field={city} header={city} />
      ))}
    </DataTable>
  );
}

export default DetailsTableLegend;
