"use client"

import { ReactNode, createContext, useContext, useState } from 'react';

type AppContextType = {
  period: string;
  setPeriod: (period: string) => void;
  customStartDate: string | null;
  setCustomStartDate: (date: string | null) => void;
  customEndDate: string | null;
  setCustomEndDate: (date: string | null) => void;
  refreshData: () => void;
};

const AppContext = createContext<AppContextType>({
  period: 'all',
  setPeriod: () => {},
  customStartDate: null,
  setCustomStartDate: () => {},
  customEndDate: null,
  setCustomEndDate: () => {},
  refreshData: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState('all');
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const refreshData = () => {
    setRefreshCounter(prev => prev + 1);
  };
  
  return (
    <AppContext.Provider
      value={{
        period,
        setPeriod,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
