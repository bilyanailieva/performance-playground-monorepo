"use client";

import { Profiler } from "react";

export default function ComboChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    // <Profiler id="ComboChartPageCLIENT" onRender={onRenderCallback}>
      <div className="absolute w-full bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] h-full p-3">
        {children}
      </div>
    // </Profiler>
  );
}
