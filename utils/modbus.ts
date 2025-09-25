// Utility functions for Modbus operations
import { ValidationResult, ModbusRequest } from '@/types';

/**
 * Calculate unit ID from grid position (10x10 grid)
 */
export const calculateGridUnitId = (row: number, col: number, gridSize: number = 10): number => {
  if (row < 1 || row > gridSize || col < 1 || col > gridSize) {
    throw new Error(`Row and column must be between 1 and ${gridSize}`);
  }
  return Number(String(row) + String(col));
};

/**
 * Convert grid position back from unit ID
 */
export const getGridPosition = (unitId: number, gridSize: number = 9): { row: number; col: number } => {
  const row = Math.floor((unitId - 1) / gridSize) + 1;
  const col = ((unitId - 1) % gridSize) + 1;
  return { row, col };
};

/**
 * Validate unit ID range
 */
export const validateUnitId = (unitId: number): ValidationResult => {
  if (unitId < 0 || unitId > 255) {
    return { isValid: false, error: 'Unit ID must be between 0 and 255' };
  }
  return { isValid: true };
};

/**
 * Validate address range
 */
export const validateAddress = (address: number): ValidationResult => {
  if (address < 0 || address > 65535) {
    return { isValid: false, error: 'Address must be between 0 and 65535' };
  }
  return { isValid: true };
};

/**
 * Validate quantity range for read operations
 */
export const validateQuantity = (quantity: number, maxQuantity: number = 125): ValidationResult => {
  if (quantity < 1 || quantity > maxQuantity) {
    return { isValid: false, error: `Quantity must be between 1 and ${maxQuantity}` };
  }
  return { isValid: true };
};

/**
 * Validate register value range
 */
export const validateRegisterValue = (value: number): ValidationResult => {
  if (value < 0 || value > 65535) {
    return { isValid: false, error: 'Register value must be between 0 and 65535' };
  }
  return { isValid: true };
};

/**
 * Validate Modbus request parameters
 */
export const validateModbusRequest = (request: ModbusRequest): ValidationResult => {
  const { action, host, unitId, address, quantity, value } = request;

  // Validate action-specific requirements
  switch (action) {
    case 'connect':
      if (!host) {
        return { isValid: false, error: 'Host is required for connect action' };
      }
      break;

    case 'readCoils':
    case 'readDiscreteInputs':
    case 'readHoldingRegisters':
    case 'readInputRegisters':
      if (unitId === undefined || address === undefined) {
        return { isValid: false, error: 'Unit ID and address are required for read operations' };
      }
      
      const unitIdResult = validateUnitId(unitId);
      if (!unitIdResult.isValid) return unitIdResult;
      
      const addressResult = validateAddress(address);
      if (!addressResult.isValid) return addressResult;
      
      if (quantity !== undefined) {
        const quantityResult = validateQuantity(quantity);
        if (!quantityResult.isValid) return quantityResult;
      }
      break;

    case 'writeCoil':
    case 'writeRegister':
      if (unitId === undefined || address === undefined || value === undefined) {
        return { isValid: false, error: 'Unit ID, address, and value are required for write operations' };
      }
      
      const writeUnitIdResult = validateUnitId(unitId);
      if (!writeUnitIdResult.isValid) return writeUnitIdResult;
      
      const writeAddressResult = validateAddress(address);
      if (!writeAddressResult.isValid) return writeAddressResult;
      
      if (action === 'writeRegister') {
        const numValue = typeof value === 'number' ? value : parseInt(String(value), 10);
        if (isNaN(numValue)) {
          return { isValid: false, error: 'Value must be a valid number for register write' };
        }
        const registerResult = validateRegisterValue(numValue);
        if (!registerResult.isValid) return registerResult;
      }
      break;

    case 'writeCoils':
      if (unitId === undefined || address === undefined || value === undefined) {
        return { isValid: false, error: 'Unit ID, address, and values are required for writeCoils operation' };
      }
      
      if (!Array.isArray(value)) {
        return { isValid: false, error: 'Values must be an array for writeCoils operation' };
      }
      
      if (value.length === 0) {
        return { isValid: false, error: 'Values array cannot be empty' };
      }
      
      if (value.length > 1968) { // Modbus specification limit for write multiple coils
        return { isValid: false, error: 'Cannot write more than 1968 coils at once' };
      }
      
      const coilsUnitIdResult = validateUnitId(unitId);
      if (!coilsUnitIdResult.isValid) return coilsUnitIdResult;
      
      const coilsAddressResult = validateAddress(address);
      if (!coilsAddressResult.isValid) return coilsAddressResult;
      break;
  }

  return { isValid: true };
};

/**
 * Format modbus data for display
 */
export const formatModbusData = (data: any): string => {
  if (Array.isArray(data)) {
    return data.join(', ');
  }
  if (typeof data === 'boolean') {
    return data ? 'TRUE' : 'FALSE';
  }
  return String(data);
};

/**
 * Parse boolean value from string
 */
export const parseBoolean = (value: string): boolean => {
  const normalized = value.toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'on';
};
