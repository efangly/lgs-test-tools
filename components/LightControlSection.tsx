import { LightPosition } from '@/types';
import { useToast, useModbusAPI } from '@/hooks';
import { calculateGridUnitId } from '@/utils/modbus';
import { Dropdown, ActionButton } from './ui/FormControls';
import { useState } from 'react';

interface LightControlSectionProps {
  lightPosition: LightPosition;
  onPositionChange: (position: LightPosition) => void;
}

export function LightControlSection({ lightPosition, onPositionChange }: LightControlSectionProps) {
  const { showSuccess, showError } = useToast();
  const { loading, executeCommand, executeCommandAsync } = useModbusAPI();
  const [boardcast, setBoardcast] = useState(false);

  const handleLightControl = async (state: boolean) => {
    try {
      const unitId = boardcast ? 0 : calculateGridUnitId(lightPosition.row, lightPosition.col);
      console.log(`Controlling light - Unit ID: ${unitId}, Address: ${1000 + lightPosition.led}, State: ${state}`);

      if (boardcast) {
        if (lightPosition.led === 0) {
          executeCommandAsync({
            action: 'writeCoils',
            unitId,
            address: 1001,
            value: [state, state, state, state, state, state, state, state]
          });
          showSuccess(`Broadcasting to all grids: Light ${state ? 'ON' : 'OFF'}`);
          return;
        }
        executeCommandAsync({
          action: 'writeCoil',
          unitId,
          address: 1000 + lightPosition.led,
          value: state
        });
        showSuccess(`Broadcasting to all grids: Light ${state ? 'ON' : 'OFF'}`);
        return;
      }

      if (lightPosition.led === 0) {
        await executeCommand({
          action: 'writeCoils',
          unitId,
          address: 1001,
          value: [state, state, state, state, state, state, state, state]
        });
        return;
      }

      await executeCommand({
        action: 'writeCoil',
        unitId,
        address: 1000 + lightPosition.led,
        value: state
      });
      showSuccess(`Setting light ${state ? 'ON' : 'OFF'} at Unit ID ${unitId}`);
    } catch (error) {
      showError(`Failed to control light: ${error}`);
    }
  };

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Light Controls</h2>
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

        {/* Position Controls */}
        <div className="grid grid-cols-3 gap-2 mb-1">
          <Dropdown
            label="Row"
            value={lightPosition.row}
            onChange={(value) => onPositionChange({ ...lightPosition, row: value })}
            disable={boardcast}
            max={10}
          />
          <Dropdown
            label="Col"
            value={lightPosition.col}
            onChange={(value) => onPositionChange({ ...lightPosition, col: value })}
            disable={boardcast}
            max={9}
          />
          <Dropdown
            label="LED"
            value={lightPosition.led}
            onChange={(value) => onPositionChange({ ...lightPosition, led: value })}
            max={8}
            options={{ value: 0, label: 'LED ALL' }}
          />
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <ActionButton onClick={() => handleLightControl(true)} disabled={loading} loading={loading} variant="success">
            ON
          </ActionButton>
          <ActionButton onClick={() => handleLightControl(false)} disabled={loading} loading={loading} variant="error">
            OFF
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
