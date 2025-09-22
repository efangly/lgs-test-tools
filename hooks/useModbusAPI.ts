import { useState } from 'react';
import { TestResult } from '@/types';
import { useToast } from './useToast';

interface ModbusCommand {
  action: string;
  unitId: number;
  address: number;
  quantity?: number;
  value?: string | number | boolean | (string | number | boolean)[];
}

export const useModbusAPI = () => {
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

  const executeCommand = async (
    command: ModbusCommand,
    onResult?: (result: TestResult) => void
  ): Promise<TestResult> => {
    setLoading(true);
    
    const testResult: TestResult = {
      timestamp: new Date().toLocaleString(),
      action: command.action,
      success: false,
      message: '',
    };

    try {
      const response = await fetch('/api/modbus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command)
      });

      const result = await response.json();
      
      testResult.success = result.success || false;
      testResult.message = result.message || result.error || 'Unknown result';
      testResult.data = result.data;
      testResult.error = result.error;

      if (result.error) {
        showError(`Error: ${result.error}`);
      }

      if (onResult) {
        onResult(testResult);
      }

      return testResult;
    } catch (error) {
      const errorMessage = `Request failed: ${error}`;
      testResult.message = errorMessage;
      testResult.error = String(error);
      
      showError(`Error: ${error}`);
      
      if (onResult) {
        onResult(testResult);
      }

      return testResult;
    } finally {
      setLoading(false);
    }
  };

  const executeCommandAsync = async (command: ModbusCommand): Promise<void> => {
    setLoading(true);
    try {
      fetch('/api/modbus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command)
      });
      return;
    } catch (error) {
      showError(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    executeCommand,
    executeCommandAsync
  };
};
