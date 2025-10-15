import { NextRequest, NextResponse } from 'next/server';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    api: 'healthy' | 'unhealthy';
    modbus: 'healthy' | 'unhealthy' | 'unknown';
  };
  environment: string;
}

// Optional: Test modbus connection health
async function checkModbusHealth(): Promise<'healthy' | 'unhealthy' | 'unknown'> {
  try {
    // Since this is a test tool and modbus connection is optional,
    // we'll return 'unknown' unless we can verify connection
    // You can implement actual modbus connectivity test here if needed
    return 'unknown';
  } catch (error) {
    console.error('Modbus health check failed:', error);
    return 'unhealthy';
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now();
    
    // Check modbus service health
    const modbusHealth = await checkModbusHealth();
    
    // Calculate uptime (process uptime in seconds)
    const uptime = process.uptime();
    
    // Get version from package.json
    const version = process.env.npm_package_version || '1.0.0';
    
    // Determine overall health status
    const isHealthy = modbusHealth !== 'unhealthy';
    
    const healthCheck: HealthCheck = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      version,
      services: {
        api: 'healthy',
        modbus: modbusHealth,
      },
      environment: process.env.NODE_ENV || 'development',
    };

    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        ...healthCheck,
        responseTime: `${responseTime}ms`,
      },
      {
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        services: {
          api: 'unhealthy',
          modbus: 'unknown',
        },
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}

// Support HEAD requests for basic health checks
export async function HEAD(): Promise<NextResponse> {
  try {
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}