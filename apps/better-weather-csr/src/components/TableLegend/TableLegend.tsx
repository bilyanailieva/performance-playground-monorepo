"use client";

import RootStore from "@/stores/RootStore";
import { observer } from "mobx-react-lite";
import { useReportWebVitals } from "next/web-vitals";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useMemo, useState } from "react";
import styles from "./TableLegend.module.scss";

const TableLegend = observer((props: { store: RootStore }) => {
  const [selection, setSelection] = useState<any>(
    props.store.tableRepresentation
  );

  useReportWebVitals((metric: any) => {
    console.log(metric);
  });

  useEffect(() => {
    setSelection(props.store.tableRepresentation);
  }, [props.store.tableRepresentation]);

  // Memoize templates to avoid unnecessary re-renders
  const tempTemplate = useMemo(
    () => (entry: any, field: string) => `${entry[field].toFixed(1)}°C`,
    []
  );

  const mmTemplate = useMemo(
    () => (entry: any, field: string) => `${entry[field].toFixed(1)}mm`,
    []
  );

  const colorTemplate = useMemo(
    () => (color: string) =>
      (
        <span
          className={styles.colorBox}
          style={{ backgroundColor: color }}
        ></span>
      ),
    []
  );

  // Memoize the columns to prevent re-rendering unless the store changes
  const columns = useMemo(
    () => [
      <Column
        key="selection"
        selectionMode="multiple"
        headerStyle={{ width: "3rem" }}
        className={styles.checkbox}
      ></Column>,
      <Column
        key="color"
        field="color"
        body={(entry) => colorTemplate(entry.color)}
      ></Column>,
      <Column
        key="cityName"
        bodyStyle={{
          maxWidth: "150px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        field="cityName"
        header="City"
      ></Column>,
      <Column
        key="avgTemp"
        field="avgTemp"
        header="Temp Avg"
        body={(entry) => tempTemplate(entry, "avgTemp")}
      ></Column>,
      <Column
        key="maxTemp"
        field="maxTemp"
        header="maxTemp"
        body={(entry) => tempTemplate(entry, "maxTemp")}
      ></Column>,
      <Column
        key="minTemp"
        field="minTemp"
        header="minTemp"
        body={(entry) => tempTemplate(entry, "minTemp")}
      ></Column>,
      <Column
        key="presipitationSum"
        field="presipitationSum"
        header="Sum Rain"
        body={(entry) => mmTemplate(entry, "presipitationSum")}
      ></Column>,
    ],
    [tempTemplate, mmTemplate, colorTemplate] // dependencies to ensure updates only when necessary
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      <DataTable
        value={props.store.tableRepresentation}
        columnResizeMode="expand"
        resizableColumns
        className="w-full h-full top-0 left-0 absolute overflow-y-auto"
        selectionMode={"checkbox"}
        selection={selection}
        onSelectionChange={(e) => {
          setSelection(e.value);
        }}
        dataKey="id"
      >
        {columns}
      </DataTable>
    </div>
  );
});

export default TableLegend;
