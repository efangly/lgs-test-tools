import { useState } from 'react';
import { useToast, useModbusAPI, useGridPosition } from '@/hooks';
import { validateUnitId } from '@/utils/modbus';
import { Dropdown, NumberInput, ActionButton } from './ui/FormControls';

export function UnitIdConfigSection() {
  const [useCurrentId, setUseCurrentId] = useState(false);
  const { showSuccess, showError } = useToast();
  const { loading, executeCommand } = useModbusAPI();
  
  const {
    position: currentPosition,
    unitId: currentUnitId,
    setRow: setCurrentRow,
    setCol: setCurrentCol,
    setUnitId: setCurrentUnitId
  } = useGridPosition();

  const {
    position: newPosition,
    unitId: newUnitId,
    setRow: setNewRow,
    setCol: setNewCol,
    setUnitId: setNewUnitId
  } = useGridPosition();

  const handleSetUnitId = async () => {
    // Validation
    if (!validateUnitId(newUnitId)) {
      showError('New Unit ID must be between 1 and 255');
      return;
    }

    if (useCurrentId && !validateUnitId(currentUnitId)) {
      showError('Current Unit ID must be between 1 and 255');
      return;
    }
    const targetUnitId = useCurrentId ? currentUnitId : 247; // Default config unit ID
    try {
      await executeCommand({ action: 'writeRegister', unitId: targetUnitId, address: 4, value: newUnitId });
      await executeCommand({ action: 'writeCoil', unitId: targetUnitId, address: 503, value: true });
      showSuccess(`Unit ID successfully set to ${newUnitId}`);
    } catch (error) {
      showError(`Failed to set Unit ID: ${error}`);
    }
  };

  return (
    <div>
      {/* Header with checkbox */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Set Unit ID</h2>
        <label className="label cursor-pointer">
          <span className="label-text mr-2">Use Current ID</span>
          <input
            type="checkbox"
            className="checkbox checkbox-accent"
            checked={useCurrentId}
            onChange={(e) => setUseCurrentId(e.target.checked)}
          />
        </label>
      </div>

      {/* Current ID Section - Show only when useCurrentId is true */}
      {useCurrentId && (
        <div className="bg-base-200 p-3 rounded-lg mb-3">
          <h3 className="text-sm font-medium mb-2 text-base-content/70">Current Device</h3>
          <div className="grid grid-cols-3 gap-2">
            <NumberInput label="Current ID" value={currentUnitId} onChange={setCurrentUnitId} min={1} max={255} />
            <Dropdown label="Row" value={currentPosition.row} onChange={setCurrentRow} max={9} />
            <Dropdown label="Col" value={currentPosition.col} onChange={setCurrentCol} max={9} />
          </div>
        </div>
      )}

      {/* New ID Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <NumberInput label="New ID" value={newUnitId} onChange={setNewUnitId} min={1} max={255} />
          <Dropdown label="Row" value={newPosition.row} onChange={setNewRow} max={9} />
          <Dropdown label="Col" value={newPosition.col} onChange={setNewCol} max={9} />
        </div>

        <ActionButton onClick={handleSetUnitId} disabled={loading} loading={loading} variant="warning" className="w-full">
          Set ID
        </ActionButton>
      </div>
    </div>
  );
}
