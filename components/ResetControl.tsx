import { useGridPosition, useModbusAPI, useToast } from "@/hooks";
import { useState } from "react";
import { ActionButton, Dropdown, NumberInput } from "./ui/FormControls";
import { validateUnitId } from "@/utils/modbus";

export function ResetControl() {
  const { showSuccess, showError } = useToast();
  const { loading, executeCommand, executeCommandAsync } = useModbusAPI();
  const [boardcast, setBoardcast] = useState(false);
  const { position: position,
    unitId: unitId,
    setRow: setRow,
    setCol: setCol,
    setUnitId: setUnitId
  } = useGridPosition();
  const handleSetUnitId = async () => {
    if (!validateUnitId(unitId)) {
      showError('New Unit ID must be between 1 and 255');
      return;
    }
    try {
      if (boardcast) {
        executeCommandAsync({ action: 'writeCoil', unitId: 0, address: 500, value: true });
        executeCommandAsync({ action: 'writeCoil', unitId: 0, address: 501, value: true });
        showSuccess(`Unit ID successfully reset for all devices`);
        return;
      }
      await executeCommand({ action: 'writeCoil', unitId: unitId, address: 500, value: true });
      await executeCommand({ action: 'writeCoil', unitId: unitId, address: 501, value: true });
      showSuccess(`Unit ID successfully reset to ${unitId}`);
    } catch (error) {
      showError(`Failed to set Unit ID: ${error}`);
    }
  };
  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className="card-body p-4">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-medium">Factory Reset</h2>
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
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <NumberInput label="ID" value={unitId} onChange={setUnitId} min={0} max={255} disable={boardcast} />
            <Dropdown label="Row" value={position.row} onChange={setRow} max={10} disable={boardcast} />
            <Dropdown label="Col" value={position.col} onChange={setCol} max={9} disable={boardcast} />
          </div>
          <div>
            <ActionButton onClick={handleSetUnitId} disabled={loading} loading={loading} variant="primary" className="w-full">
              Reset
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}
