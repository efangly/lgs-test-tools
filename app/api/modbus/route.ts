import { NextRequest, NextResponse } from 'next/server';
import { ModbusRequest, ModbusResponse } from '@/types';
import { modbusService } from '@/lib/modbus-service';

export async function POST(request: NextRequest): Promise<NextResponse<ModbusResponse>> {
  try {
    const body: ModbusRequest = await request.json();
    
    // Execute request using service
    const result = await modbusService.executeRequest(body);
    
    // Return appropriate status code
    const statusCode = result.success ? 200 : (result.error?.includes('required') ? 400 : 500);
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('Modbus API error:', error);
    
    const errorResponse: ModbusResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse<ModbusResponse>> {
  try {
    const status = modbusService.isConnected();
    
    return NextResponse.json({
      success: true,
      connected: status,
      message: status ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    console.error('Modbus status check error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
