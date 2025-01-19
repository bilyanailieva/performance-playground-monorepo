// src/components/RootStoreProvider.tsx
"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import RootStore from "@/stores/RootStore";

export const rootStoreContext = createContext<RootStore | null>(null);

export default function RootStoreProvider({ userLocation, children }: { userLocation: any, children: ReactNode }) {
  const [rootStore] = useState(() => new RootStore());
  useEffect(() => {
    if(userLocation) {
      rootStore.setLocation(userLocation); 
      }
  }, [])

  return (
    <rootStoreContext.Provider value={rootStore}>
      {children}
    </rootStoreContext.Provider>
  );
}