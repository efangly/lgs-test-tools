
'use client';

import { useState } from 'react';
import { NumberInput, ActionButton, Dropdown } from './ui/FormControls';
import { useModbusAPI } from '@/hooks/useModbusAPI';
import { useToast } from '@/hooks';

export function SetColorControl() {
  const [red, setRed] = useState(255);
  const [green, setGreen] = useState(255);
  const [blue, setBlue] = useState(255);
  const [brightness, setBrightness] = useState(100);
  const [positions, setPositions] = useState({ row: 1, col: 1, led: 1 });
  const [boardcast, setBoardcast] = useState(false);
  const { showSuccess, showError } = useToast();
  const { executeCommand, executeCommandAsync, loading } = useModbusAPI();

  const handleSetBrightness = async () => {
    try {
      const targetUnitId = Number(`${positions.row}${positions.col}`);
      if (boardcast) {
        executeCommandAsync({
          action: 'writeRegister',
          unitId: 0,
          address: Number(`1${positions.led}0`),
          value: brightness
        });
        await new Promise(resolve => setTimeout(resolve, 2000)); // slight delay to ensure order
        executeCommandAsync({
          action: 'writeCoil',
          unitId: 0,
          address: 503,
          value: true
        });
        showSuccess(`Broadcasting to all grids`);
        return;
      }
      await executeCommand({ action: 'writeRegister', unitId: targetUnitId, address: Number(`1${positions.led}0`), value: brightness });
      await executeCommand({ action: 'writeCoil', unitId: targetUnitId, address: 503, value: true });
      showSuccess(`Broadcasting to ${positions.led} at Unit ID ${targetUnitId}`);
    } catch (error) {
      showError(`Failed to set brightness: ${error}`);
    }
  };

  const handleSetColor = async () => {
    try {
      const targetUnitId = Number(`${positions.row}${positions.col}`);
      if (boardcast) {
        executeCommandAsync({
          action: 'writeRegisters',
          unitId: 0,
          address: Number(`1${positions.led}1`),
          value: [red, green, blue]
        });
        await new Promise(resolve => setTimeout(resolve, 2000)); // slight delay to ensure order
        executeCommandAsync({
          action: 'writeCoil',
          unitId: 0,
          address: 503,
          value: true
        });
        showSuccess(`Broadcasting to all grids`);
        return;
      }
      await executeCommand({ action: 'writeRegisters', unitId: targetUnitId, address: Number(`1${positions.led}1`), value: [red, green, blue] });
      await executeCommand({ action: 'writeCoil', unitId: targetUnitId, address: 503, value: true });
      showSuccess(`Color set to rgb(${red}, ${green}, ${blue}) at Unit ID ${targetUnitId}`);
    } catch (error) {
      showError(`Failed to set color: ${error}`);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">RGB Color & Brightness Control</h2>
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Broadcast</span>
            <input
              type="checkbox"
              className="checkbox checkbox-accent"
              checked={boardcast}
              onChange={(e) => setBoardcast(e.target.checked)}
            />
          </label>
        </div>
        {/* RGB Color Inputs */}
        <div className="grid grid-cols-4 gap-2 items-end">
          <NumberInput label="Red" value={red} onChange={setRed} min={0} max={255} />
          <NumberInput label="Green" value={green} onChange={setGreen} min={0} max={255} />
          <NumberInput label="Blue" value={blue} onChange={setBlue} min={0} max={255} />
          {/* Color Preview */}
          <div>
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div
              className="w-full h-12 rounded-md border-2 border-gray-300"
              style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
            />
          </div>
        </div>

        {/* Brightness Slider */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Brightness: {brightness}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="range range-primary w-full"
          />
        </div>

        {/* Unit ID Configuration */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <Dropdown
            label="Row"
            value={positions.row}
            onChange={(value) => setPositions({ ...positions, row: value })}
            disable={boardcast}
            max={10}
          />
          <Dropdown
            label="Col"
            value={positions.col}
            onChange={(value) => setPositions({ ...positions, col: value })}
            disable={boardcast}
            max={9}
          />
          <Dropdown
            label="LED"
            value={positions.led}
            onChange={(value) => setPositions({ ...positions, led: value })}
            max={8}
          />
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <ActionButton
            onClick={handleSetBrightness}
            disabled={loading}
            loading={loading}
            variant="warning"
            className="flex-1"
          >
            Set Brightness
          </ActionButton>

          <ActionButton
            onClick={handleSetColor}
            disabled={loading}
            loading={loading}
            variant="primary"
            className="flex-1"
          >
            Set Color
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
