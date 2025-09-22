'use client';

import { useResults } from '../hooks';

export function ResultsPanel() {
  const { results, clearResults } = useResults();

  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No test results yet. Run some commands to see results here.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{result.action}</span>
                <span className="text-sm text-gray-500">{result.timestamp}</span>
              </div>
              <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message}
              </p>
              {result.data && (
                <div className="mt-2 p-2 rounded text-sm">
                  <strong>Data:</strong> {JSON.stringify(result.data)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {results.length > 0 && (
        <button
          onClick={clearResults}
          className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Clear Results
        </button>
      )}
    </div>
  );
}
