"use client";

import { useCollectWebVitals } from "@/hooks/useWebReportVitals";
import { useReportWebVitals } from "next/web-vitals";
import { Profiler } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const onRenderCallback = (
    id: string, // the "id" prop of the Profiler tree that has just committed
    phase: "mount" | "update" | "nested-update", // either "mount" (for the initial mount) or "update" (for re-renders)
    actualDuration: number, // time spent rendering the committed update
    baseDuration: number, // estimated time to render the entire subtree without memoization
    startTime: number, // when React began rendering this update
    commitTime: number // when React committed this update
  ) => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    });
  };
  useCollectWebVitals();
  return (
    <Profiler id="dashboard" onRender={onRenderCallback}>
      <div className="absolute min-h-full w-full bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] h-full p-3">
        {children}
      </div>
    </Profiler>
  );
}