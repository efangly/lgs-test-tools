'use client';

import { useState } from 'react';
import { ActionButton, Dropdown } from './ui/FormControls';
import { useModbusAPI } from '@/hooks/useModbusAPI';
import { useResults } from '@/hooks/ResultsContext';

interface UnitRegisterValues {
  unitId: number;
  registers: {
    address: number;
    value: number;
  }[];
}

export function ReadControl() {
  const [unitIds, setUnitIds] = useState('11');
  const [row, setRow] = useState(0);
  const [unitRegisterValues, setUnitRegisterValues] = useState<UnitRegisterValues[]>([]);
  const [isReading, setIsReading] = useState(false);

  const { executeCommand, loading } = useModbusAPI();
  const { addResult } = useResults();

  const FIXED_ADDRESS = 0;
  const FIXED_QUANTITY = 5;

  const parseUnitIds = (input: string): number[] => {
    return input
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && id >= 1 && id <= 255);
  };

  const handleReadHoldingRegisters = async () => {
    setIsReading(true);
    const parsedUnitIds = parseUnitIds(unitIds);

    if (parsedUnitIds.length === 0) {
      setIsReading(false);
      return;
    }

    try {
      const results: UnitRegisterValues[] = [];

      for (const unitId of parsedUnitIds) {
        const result = await executeCommand(
          {
            action: 'readHoldingRegisters',
            unitId,
            address: FIXED_ADDRESS,
            quantity: FIXED_QUANTITY
          },
          addResult
        );

        if (result.success && Array.isArray(result.data)) {
          const registers = result.data.map((value: number, index: number) => ({
            address: FIXED_ADDRESS + index,
            value
          }));

          results.push({
            unitId,
            registers
          });
        }
      }

      setUnitRegisterValues(results);
    } catch (error) {
      console.error('Error reading holding registers:', error);
      setUnitRegisterValues([]);
    } finally {
      setIsReading(false);
    }
  };

  const setRowResult = (value: number) => {
    let allRows: string[] = [];
    for (let i = 1; i < 9; i++) allRows.push(((value * 10) + i).toString());
    setUnitIds(allRows.join(','));
    setRow(value);
  };

  const clearResults = () => {
    setUnitRegisterValues([]);
  };

  return (
    <div className="space-y-2 my-2">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg font-semibold mb-4">Read LGS Info</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unit IDs (comma-separated)</label>
              <input
                type="text"
                value={unitIds}
                onChange={(e) => setUnitIds(e.target.value)}
                className="input input-bordered w-full"
                placeholder="1, 2, 3"
                disabled={isReading}
              />
              <div className="text-xs text-gray-500 mt-1">
                Enter Unit IDs separated by commas (e.g., 1, 2, 3). Fixed: Address=0, Quantity=5
              </div>
            </div>
            <Dropdown label="Row" value={row} onChange={(value) => setRowResult(value)} disable={isReading} max={10} />
          </div>

          <div className="flex gap-2">
            <ActionButton
              onClick={handleReadHoldingRegisters}
              disabled={isReading || parseUnitIds(unitIds).length === 0}
              loading={isReading}
              variant="primary"
              className="flex-1"
            >
              {isReading ? 'Reading...' : `Read Registers (${parseUnitIds(unitIds).length} Unit${parseUnitIds(unitIds).length !== 1 ? 's' : ''})`}
            </ActionButton>
            <ActionButton
              onClick={clearResults}
              disabled={isReading}
              variant="warning"
              className="flex-1"
            >
              Clear Results
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Unit Register Values Display */}
      {unitRegisterValues.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Register Values ({unitRegisterValues.length} Unit{unitRegisterValues.length !== 1 ? 's' : ''})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unitRegisterValues.map((unitData, unitIndex) => (
              <div key={unitIndex} className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-700 dark:to-blue-600 shadow-lg border border-blue-200 dark:border-blue-500">
                <div className="card-body p-4">
                  <h4 className="font-bold text-lg text-blue-800 dark:text-blue-200 mb-3 text-center">
                    Unit ID {unitData.unitId}
                  </h4>
                  <div className="space-y-2">
                    {unitData.registers.map((register, regIndex) => (
                      <div key={regIndex} className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {regIndex === 0 ? 'Device Type' : regIndex === 1 ? 'Firmware Version' : regIndex === 2 ? 'Hardware Version' : regIndex === 3 ? 'Baud Rate' : regIndex === 4 ? 'Slave ID' : `${register.address}`}:
                        </span>
                        <div className="text-right">
                          <div className="font-bold text-blue-900 dark:text-blue-100">
                            {register.value}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-300">
                            0x{register.value.toString(16).toUpperCase().padStart(4, '0')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {unitRegisterValues.length === 0 && !isReading && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body text-center py-8">
            <p className="text-gray-500">No register values to display. Enter Unit IDs and click "Read Registers" to get started.</p>
            <p className="text-xs text-gray-400 mt-2">Fixed: Address=0, Quantity=5</p>
          </div>
        </div>
      )}
    </div>
  );
}