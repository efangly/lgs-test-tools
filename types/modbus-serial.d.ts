declare module 'modbus-serial' {
  export interface ModbusRTUOptions {
    port?: number;
    debug?: boolean;
    unitId?: number;
  }

  export interface ModbusResult {
    data: number[] | boolean[];
    buffer: Buffer;
  }

  export default class ModbusRTU {
    constructor();
    
    // Connection methods
    connectTCP(ip: string, options?: ModbusRTUOptions): Promise<void>;
    connectRTU(path: string, options?: any): Promise<void>;
    connectAscii(path: string, options?: any): Promise<void>;
    connectTelnet(ip: string, options?: any): Promise<void>;
    close(): void;
    
    // Status methods
    isOpen: boolean;
    setTimeout(timeout: number): void;
    setID(unitId: number): void;
    getID(): number;
    
    // Read methods
    readCoils(address: number, length: number): Promise<ModbusResult>;
    readDiscreteInputs(address: number, length: number): Promise<ModbusResult>;
    readHoldingRegisters(address: number, length: number): Promise<ModbusResult>;
    readInputRegisters(address: number, length: number): Promise<ModbusResult>;
    
    // Write methods
    writeCoil(address: number, value: boolean): Promise<ModbusResult>;
    writeRegister(address: number, value: number): Promise<ModbusResult>;
    writeCoils(address: number, values: boolean[]): Promise<ModbusResult>;
    writeRegisters(address: number, values: number[]): Promise<ModbusResult>;
  }
}
