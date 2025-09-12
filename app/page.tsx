'use client';

import { LightPanel, Navbar, ResultsPanel, TestCommandsPanel } from '@/components';
import { ResultsProvider } from '@/hooks';

export default function Home() {
  return (
    <ResultsProvider>
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto">
          <Navbar />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {/* Test Light Panel */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-2 md:p-4">
                <LightPanel />
              </div>
            </div>
            {/* Test Commands Panel */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-2 md:p-4">
                <TestCommandsPanel />
              </div>
            </div>
          </div>
          {/* Results Panel */}
          <div className="card bg-base-100 shadow-xl mt-2">
            <div className="card-body p-2 md:p-4">
              <h2 className="card-title">Results</h2>
              <ResultsPanel />
            </div>
          </div>
        </div>
      </div>
    </ResultsProvider>
  );
}
