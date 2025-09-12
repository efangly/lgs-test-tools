export interface ConnectionState {
  connected: boolean;
  host: string;
  port: number;
}

export interface TestResult {
  timestamp: string;
  action: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface ResultsContextType {
  results: TestResult[];
  addResult: (result: TestResult) => void;
  clearResults: () => void;
}

export interface ModbusWriteValue {
  coil: boolean;
  register: number;
}

export interface LightPosition {
  row: number;
  col: number;
  led: number;
}

export interface UnitIdPosition {
  row: number;
  col: number;
}

export interface ModbusRequest {
  action: ModbusAction;
  host?: string;
  port?: number;
  unitId?: number;
  address?: number;
  value?: string | number | boolean;
  quantity?: number;
}

export interface ModbusResponse {
  success?: boolean;
  error?: string;
  message?: string;
  data?: number[] | boolean[] | unknown;
  connected?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export type ModbusAction = 
  | 'connect'
  | 'disconnect'
  | 'status'
  | 'readCoils'
  | 'readDiscreteInputs'
  | 'readHoldingRegisters'
  | 'readInputRegisters'
  | 'writeCoil'
  | 'writeRegister';
