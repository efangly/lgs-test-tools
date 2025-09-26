'use client';

import { useState } from 'react';
import { LightPanel, Navbar, ReadControl, ResultsPanel, TestCommandsPanel } from '@/components';
import { ResultsProvider } from '@/hooks';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'lights' | 'commands' | 'read'>('lights');

  return (
    <ResultsProvider>
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto">
          <Navbar />

          {/* Tabs Navigation */}
          <div className="tabs tabs-boxed p-2 my-2 justify-center bg-base-100 shadow-xl rounded-2xl">
            <button
              className={`tab text-lg font-medium ${activeTab === 'lights' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('lights')}
            >
              Light Panel
            </button>
            <button
              className={`tab text-lg font-medium ${activeTab === 'commands' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('commands')}
            >
              Test Commands
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'lights' && (
            <>
              <LightPanel />
              <ReadControl />
            </>
          )}

          {activeTab === 'commands' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Test Commands Panel */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-2 md:p-4">
                  <TestCommandsPanel />
                </div>
              </div>

              {/* Results Panel */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-2 md:p-4">
                  <h2 className="card-title">Results</h2>
                  <ResultsPanel />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ResultsProvider>
  );
}
