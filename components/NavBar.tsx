'use client';

import { useState, useEffect } from 'react';
import { ConnectionState } from '@/types';
import { useToast } from '@/hooks';
import { ConnectionStatus } from './ConnectionStatus';
import ThemeToggle from './ThemeToggle';

export function Navbar() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectionState');
      if (saved) return JSON.parse(saved);
    }
    return {
      connected: false,
      host: '192.168.7.200',
      port: 502
    };
  });
  const [loading, setLoading] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  
  const { showSuccess, showError } = useToast();

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/modbus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      });
      const result = await response.json();
      setConnectionState(prev => ({ ...prev, connected: result.connected }));
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('connectionState', JSON.stringify(connectionState));
    }
  }, [connectionState]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/modbus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          host: connectionState.host,
          port: connectionState.port
        })
      });
      const result = await response.json();
      if (result.success) {
        setConnectionState(prev => ({ ...prev, connected: true }));
        setShowConnectionModal(false);
        showSuccess(`Connected to ${connectionState.host}:${connectionState.port}`);
      } else {
        showError(`Error: ${result.error}`);
      }
    } catch (error) {
      showError('Connection failed: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/modbus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' })
      });
      const result = await response.json();
      if (result.success) {
        setConnectionState(prev => ({ ...prev, connected: false }));
        showSuccess(`Disconnected from ${connectionState.host}:${connectionState.port}`);
      }
    } catch (error) {
      showError('Disconnect failed: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto sticky top-0 z-50'>
      <div className="bg-base-100 shadow-lg p-2 md:p-4 rounded-b-2xl">
        {/* Banner always on top */}
        <div className="w-full mb-2 flex justify-center">
          <h1 className="text-xl font-bold">LGS Test Tools</h1>
        </div>
        {/* Responsive controls: stack on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Center: Connection Status & Controls */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
            {/* Connection Controls */}
            <div className="flex space-x-2 justify-between">
              {connectionState.connected ? (
                <button onClick={handleDisconnect} disabled={loading} className="btn btn-md btn-error">
                  {loading ? 'Disconnecting...' : 'Disconnect'}
                </button>
              ) : (
                <button onClick={handleConnect} disabled={loading} className="btn btn-md btn-accent">
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
              )}
              <button onClick={() => setShowConnectionModal(true)} className="btn btn-md btn-outline">
                Settings
              </button>
            </div>
          </div>
          {/* End: Theme Toggle */}
          <div className="flex justify-between md:justify-center">
            {/* Connection Status Indicator */}
            <ConnectionStatus connected={connectionState.connected} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Connection Settings Modal */}
      {showConnectionModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Connection Settings</h3>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Host/IP Address</span>
              </label>
              <input
                type="text"
                value={connectionState.host}
                onChange={(e) => setConnectionState(prev => ({ ...prev, host: e.target.value }))}
                className="input input-bordered w-full"
                placeholder="192.168.1.100"
              />
            </div>

            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Port</span>
              </label>
              <input
                type="number"
                value={connectionState.port}
                onChange={(e) => setConnectionState(prev => ({ ...prev, port: parseInt(e.target.value) || 502 }))}
                className="input input-bordered w-full"
                placeholder="502"
              />
            </div>
            <div className="modal-action">
              <button onClick={() => setShowConnectionModal(false)} className="btn btn-ghost">OK</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowConnectionModal(false)}>
            <button>close</button>
          </div>
        </div>
      )}
    </div>
  );
}

