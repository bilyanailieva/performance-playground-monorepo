"use client";
import { Calendar } from "primereact/calendar";
import { useEffect, useState } from "react";

type DateBoxProps = {
  onChange: (e: any) => void;
  defaultValue: string;
};

export const DateBox = (props: DateBoxProps) => {
  const [date, setDate] = useState(props.defaultValue);
  useEffect(() => {
    setDate(props.defaultValue);
  }, [props.defaultValue]);

  const onChange = (e: any) => {
    setDate(e.value);
    props.onChange(e);
  };

  return (
    <Calendar
      className="p-calendar"
      value={new Date(date)}
      onChange={onChange}
    />
  );
};
