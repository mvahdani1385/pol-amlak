// contexts/DataContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// تعریف تایپ دیتا (بر اساس API خودت تغییر بده)
interface MyDataType {
  id: number;
  title: string;
  description: string;
  // هر فیلدی که داری
}

export type DataContextType = {
  dynamicdata?: any; 
  dynamicloading?: boolean;
  dynamicerror?: any;
  refetch: () => void;
}



const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dynamicdata, setData] = useState<any[] | null>(null);
  const [dynamicloading, setLoading] = useState(true);
  const [dynamicerror, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // آدرس API خودت رو اینجا جایگزین کن
      const response = await fetch('/api/dynamicOptions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت دیتا');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // فقط یک بار در ابتدا fetch کن
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ dynamicdata, dynamicloading, dynamicerror, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

// Hook سفارشی برای استفاده راحت
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}