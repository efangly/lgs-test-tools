'use client';

import { createContext, useContext, useState } from 'react';
import { TestResult, ResultsContextType } from '@/types';

export const ResultsContext = createContext<ResultsContextType>({
  results: [],
  addResult: () => {},
  clearResults: () => {}
});

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

export function ResultsProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<TestResult[]>([]);

  const addResult = (result: TestResult) => {
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <ResultsContext.Provider value={{ results, addResult, clearResults }}>
      {children}
    </ResultsContext.Provider>
  );
}
