"use client";
import { useReportWebVitals } from "next/web-vitals";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Profiler, useEffect, useState } from "react";
import styles from "./TableLegend.module.scss";
import {Button} from '@my-org/shared-components';

type TableLegendProps = {
  tableData: any[];
  cityColors: string[];
  // onSelectionChange: (data: any[]) => void;
};

const TableLegend = (props: TableLegendProps) => {
  const [selection, setSelection] = useState<any>(props.tableData);
  useReportWebVitals((metric: any) => {
    console.log(metric);
  });
  useEffect(() => {
    setSelection(props.tableData);
  }, [props.tableData]);

  const tempTemplate = (entry: any, field: string) => {
    return `${entry[field].toFixed(1)}°C`;
  };

  const mmTemplate = (entry: any, field: string) => {
    return `${entry[field].toFixed(1)}mm`;
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
    <Profiler id='DATATBLE' onRender={() => console.log('i rendered')}>
    <div className="relative w-full h-full overflow-hidden">
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
    </Profiler>
  ) : (
    <></>
  );
};

export default TableLegend;
