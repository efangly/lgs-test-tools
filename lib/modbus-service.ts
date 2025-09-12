import ModbusRTU from 'modbus-serial';
import { ModbusRequest, ModbusResponse } from '@/types';
import { validateModbusRequest, parseBoolean } from '@/utils/modbus';
import { Logger, withRetry } from './utils';

/**
 * Modbus Service Class
 * Handles all Modbus operations with proper error handling and validation
 */
export class ModbusService {
  private client: ModbusRTU | null = null;
  private readonly defaultTimeout = 5000;

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.client?.isOpen || false;
  }

  /**
   * Connect to Modbus TCP server
   */
  async connect(host: string, port: number = 502): Promise<ModbusResponse> {
    try {
      Logger.info(`Attempting to connect to Modbus server`, { host, port });
      
      // Close existing connection if any
      if (this.client?.isOpen) {
        this.client.close();
        Logger.info('Closed existing connection');
      }
      
      this.client = new ModbusRTU();
      
      // Use retry mechanism for connection
      await withRetry(async () => {
        await this.client!.connectTCP(host, { port });
      }, 3, 1000);
      
      this.client.setTimeout(this.defaultTimeout);
      
      Logger.info(`Successfully connected to Modbus server`, { host, port });
      
      return { 
        success: true, 
        message: `Connected to ${host}:${port}`,
        connected: true
      };
    } catch (error) {
      Logger.error('Failed to connect to Modbus server', error);
      
      return { 
        success: false,
        error: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        connected: false
      };
    }
  }

  /**
   * Disconnect from Modbus server
   */
  async disconnect(): Promise<ModbusResponse> {
    try {
      Logger.info('Disconnecting from Modbus server');
      
      if (this.client?.isOpen) {
        this.client.close();
      }
      this.client = null;
      
      Logger.info('Successfully disconnected from Modbus server');
      
      return { 
        success: true, 
        message: 'Disconnected',
        connected: false
      };
    } catch (error) {
      Logger.error('Failed to disconnect from Modbus server', error);
      
      return { 
        success: false,
        error: `Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        connected: false
      };
    }
  }

  /**
   * Read Coils (Function Code 1)
   */
  async readCoils(unitId: number, address: number, quantity: number = 1): Promise<ModbusResponse> {
    return this.performReadOperation('readCoils', unitId, address, quantity);
  }

  /**
   * Read Discrete Inputs (Function Code 2)
   */
  async readDiscreteInputs(unitId: number, address: number, quantity: number = 1): Promise<ModbusResponse> {
    return this.performReadOperation('readDiscreteInputs', unitId, address, quantity);
  }

  /**
   * Read Holding Registers (Function Code 3)
   */
  async readHoldingRegisters(unitId: number, address: number, quantity: number = 1): Promise<ModbusResponse> {
    return this.performReadOperation('readHoldingRegisters', unitId, address, quantity);
  }

  /**
   * Read Input Registers (Function Code 4)
   */
  async readInputRegisters(unitId: number, address: number, quantity: number = 1): Promise<ModbusResponse> {
    return this.performReadOperation('readInputRegisters', unitId, address, quantity);
  }

  /**
   * Write Single Coil (Function Code 5)
   */
  async writeCoil(unitId: number, address: number, value: string | number | boolean): Promise<ModbusResponse> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Modbus server' };
    }

    try {
      // Convert value to boolean
      const boolValue = this.convertToBoolean(value);
      
      this.client!.setID(unitId);
      await this.client!.writeCoil(address, boolValue);
      
      return { 
        success: true, 
        message: `Written ${boolValue} to coil at address ${address}` 
      };
    } catch (error) {
      return { 
        success: false,
        error: `Failed to write coil: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Write Single Register (Function Code 6)
   */
  async writeRegister(unitId: number, address: number, value: string | number | boolean): Promise<ModbusResponse> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Modbus server' };
    }

    try {
      // Convert value to number
      const numValue = this.convertToNumber(value);
      if (numValue === null) {
        return { success: false, error: 'Value must be a valid number' };
      }
      
      this.client!.setID(unitId);
      await this.client!.writeRegister(address, numValue);
      
      return { 
        success: true, 
        message: `Written ${numValue} to register at address ${address}` 
      };
    } catch (error) {
      return { 
        success: false,
        error: `Failed to write register: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Execute Modbus request
   */
  async executeRequest(request: ModbusRequest): Promise<ModbusResponse> {
    // Validate request
    const validation = validateModbusRequest(request);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const { action, host, port, unitId, address, quantity, value } = request;

    switch (action) {
      case 'connect':
        return this.connect(host!, port);
      
      case 'disconnect':
        return this.disconnect();
      
      case 'status':
        return { 
          success: true,
          connected: this.isConnected(),
          message: this.isConnected() ? 'Connected' : 'Disconnected'
        };
      
      case 'readCoils':
        return this.readCoils(unitId!, address!, quantity);
      
      case 'readDiscreteInputs':
        return this.readDiscreteInputs(unitId!, address!, quantity);
      
      case 'readHoldingRegisters':
        return this.readHoldingRegisters(unitId!, address!, quantity);
      
      case 'readInputRegisters':
        return this.readInputRegisters(unitId!, address!, quantity);
      
      case 'writeCoil':
        return this.writeCoil(unitId!, address!, value!);
      
      case 'writeRegister':
        return this.writeRegister(unitId!, address!, value!);
      
      default:
        return { success: false, error: 'Invalid action' };
    }
  }

  /**
   * Private helper method for read operations
   */
  private async performReadOperation(
    operation: 'readCoils' | 'readDiscreteInputs' | 'readHoldingRegisters' | 'readInputRegisters',
    unitId: number,
    address: number,
    quantity: number
  ): Promise<ModbusResponse> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Modbus server' };
    }
    
    try {
      this.client!.setID(unitId);
      const result = await this.client![operation](address, quantity);
      
      return { 
        success: true, 
        data: result.data,
        message: `Read ${quantity} ${operation.replace('read', '').toLowerCase()} from address ${address}` 
      };
    } catch (error) {
      return { 
        success: false,
        error: `Failed to ${operation}: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Convert value to boolean
   */
  private convertToBoolean(value: string | number | boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    return parseBoolean(String(value));
  }

  /**
   * Convert value to number
   */
  private convertToNumber(value: string | number | boolean): number | null {
    if (typeof value === 'number') {
      return value;
    }
    
    const numValue = typeof value === 'string' ? parseInt(value, 10) : Number(value);
    return isNaN(numValue) ? null : numValue;
  }
}

// Export singleton instance
export const modbusService = new ModbusService();
