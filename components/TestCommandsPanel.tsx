'use client';

import { useState } from 'react';
import { useResults, useModbusAPI } from '@/hooks';
import { ModbusAction } from '@/types';

export function TestCommandsPanel() {
  const [unitId, setUnitId] = useState(0);
  const [address, setAddress] = useState(0);
  const [value, setValue] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { addResult } = useResults();
  const { loading, executeCommand } = useModbusAPI();

  const handleCommand = async (action: ModbusAction) => {
    let commandValue: string | number | boolean | undefined;

    // Handle different value types based on action
    if (action === 'writeCoil') {
      commandValue = value.toLowerCase() === 'true';
    } else if (action === 'writeRegister') {
      commandValue = parseInt(value) || 0;
    }

    const result = await executeCommand({
      action,
      unitId,
      address,
      quantity,
      value: commandValue
    }, addResult);

    return result;
  };

  const InputField = ({
    label,
    value,
    onChange,
    type = "number",
    min,
    max,
    placeholder
  }: {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: string;
    min?: number;
    max?: number;
    placeholder?: string;
  }) => (
    <div>
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) || (min || 0) : e.target.value)}
        className="input input-bordered w-full"
        min={min}
        max={max}
        placeholder={placeholder}
      />
    </div>
  );

  const CommandButton = ({
    action,
    children,
    color = "green",
    disabled = false
  }: {
    action: ModbusAction;
    children: React.ReactNode;
    color?: "green" | "orange";
    disabled?: boolean;
  }) => (
    <button
      onClick={() => handleCommand(action)}
      disabled={loading || disabled}
      className={`${color === 'green'
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-orange-500 hover:bg-orange-600'
        } text-white px-4 py-2 rounded-md disabled:bg-gray-400 transition-colors`}
    >
      {loading ? 'Processing...' : children}
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:gap-4">
      {/* Common Parameters */}
      <div>
        <h2 className="text-lg font-medium mb-3">Test Commands</h2>
        <div className="grid grid-cols-4 gap-2">
          <InputField
            label="Unit ID"
            value={unitId}
            onChange={(value) => setUnitId(Number(value))}
            min={0}
            max={255}
          />
          <InputField
            label="Address"
            value={address}
            onChange={(value) => {setAddress(Number(value))}}
            min={0}
          />
          <InputField
            label="Quantity"
            value={quantity}
            onChange={(value) => setQuantity(Number(value))}
            min={1}
            max={125}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                e.stopPropagation(); // Prevent focus loss
                setValue(e.target.value);
              }}
              className="input input-bordered w-full"
              placeholder="true/false, number"
              list="value-suggestions"
            />
            <datalist id="value-suggestions">
              <option value="true" />
              <option value="false" />
            </datalist>
          </div>
        </div>
      </div>

      {/* Read Commands */}
      <div>
        <h3 className="text-lg font-medium mb-3">Read</h3>
        <div className="grid grid-cols-2 gap-2">
          <CommandButton action="readCoils">
            Coils
          </CommandButton>
          <CommandButton action="readDiscreteInputs">
            Discrete Inputs
          </CommandButton>
          <CommandButton action="readHoldingRegisters">
            Holding Registers
          </CommandButton>
          <CommandButton action="readInputRegisters">
            Input Registers
          </CommandButton>
        </div>
      </div>

      {/* Write Commands */}
      <div>
        <h3 className="text-lg font-medium mb-3">Write</h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          <CommandButton
            action="writeCoil"
            color="orange"
            disabled={!value}
          >
            Single Coil
          </CommandButton>
          <CommandButton
            action="writeRegister"
            color="orange"
            disabled={!value}
          >
            Single Register
          </CommandButton>
        </div>
      </div>
    </div>
  );
}
