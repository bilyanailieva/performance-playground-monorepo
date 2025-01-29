"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import styles from "./TableLegend.module.scss";
import {Button} from '@my-org/shared-components';

type TableLegendProps = {
  tableData: any[];
  cityColors: string[];
};

const TableLegend = (props: TableLegendProps) => {
  const [selection, setSelection] = useState<any>(props.tableData);
  useEffect(() => {
    setSelection(props.tableData);
  }, [props.tableData]);

  const tempTemplate = (entry: any, field: string) => {
    return `${entry[field]?.toFixed(1)}°C`;
  };

  const mmTemplate = (entry: any, field: string) => {
    return `${entry[field]?.toFixed(1)}mm`;
  };

  const colorTemplate = (color: string) => {
    return (
      <span
        className={styles.colorBox}
        style={{ backgroundColor: color }}
      ></span>
    );
  };

  return props?.tableData?.length ? (
    <div className="m-w-24 min-h-full absolute w-full h-full overflow-hidden">
      {/* Following line is just for testing */}
      <Button label={'Test'} onClick={() => {}}/>
      <DataTable
        value={props.tableData}
        columnResizeMode="expand"
        resizableColumns
        className="w-full h-full top-0 left-0 absolute overflow-y-auto"
        selectionMode={"checkbox"}
        selection={selection}
        onSelectionChange={(e) => {
          setSelection(e.value);
          // props.onSelectionChange(e.value);
        }}
        dataKey="id"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
          className={styles.checkbox}
        ></Column>
        <Column
          field="color"
          body={(entry) => colorTemplate(entry.color)}
        ></Column>
        <Column
          bodyStyle={{
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          field="cityName"
          header="City"
        ></Column>
        <Column
          field="avgTemp"
          header="Temp Avg"
          body={(entry) => tempTemplate(entry, "avgTemp")}
        ></Column>
        <Column
          field="maxTemp"
          header="maxTemp"
          body={(entry) => tempTemplate(entry, "maxTemp")}
        ></Column>
        <Column
          field="minTemp"
          header="minTemp"
          body={(entry) => tempTemplate(entry, "minTemp")}
        ></Column>
        <Column
          field="presipitationSum"
          header="Sum Rain"
          body={(entry) => mmTemplate(entry, "presipitationSum")}
        ></Column>
      </DataTable>
    </div>
  ) : (
    <></>
  );
};

export default TableLegend;

export type NestedRow = {
  metric: string;
  [city: string]: number | string | undefined; // Metric values for each city
};

export type NestedTableData = {
  datetime: string;
  metrics: NestedRow[]; // Nested data for each datetime
};

