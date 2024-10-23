"use client";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,_0,_0,_0.2),_0_1px_1px_0_rgba(0,_0,_0,_0.14),_0_1px_3px_0_rgba(0,_0,_0,_0.12)] w-full h-full p-3">
      {children}
    </div>
  );
}
