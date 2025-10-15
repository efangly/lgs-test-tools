# Health Check Documentation

## Overview

This project includes comprehensive health check functionality to monitor the application's status and availability.

## Health Check Endpoint

### GET `/api/health`

Returns the current health status of the application and its services.

#### Response Format

```json
{
  "status": "healthy" | "unhealthy",
  "timestamp": "2025-10-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "services": {
    "api": "healthy" | "unhealthy",
    "modbus": "healthy" | "unhealthy" | "unknown"
  },
  "environment": "production" | "development",
  "responseTime": "15ms"
}
```

#### Response Codes

- **200 OK**: Application is healthy
- **503 Service Unavailable**: Application is unhealthy

#### Response Headers

- `Cache-Control: no-cache, no-store, must-revalidate`
- `Pragma: no-cache`
- `Expires: 0`

### HEAD `/api/health`

Lightweight health check that returns only HTTP status codes without response body.

## Service Status Definitions

### API Service
- **healthy**: API is responding normally
- **unhealthy**: API is experiencing issues

### Modbus Service
- **healthy**: Modbus connection is active and working
- **unhealthy**: Modbus connection failed or is experiencing issues
- **unknown**: Modbus connection status cannot be determined (default for test environment)

## Usage

### Local Development

Check application health locally:

```bash
# Basic health check
npm run health

# Health check with JSON formatting (requires jq)
npm run health:json

# Manual curl request
curl http://localhost:3000/api/health
```

### Docker Environment

The Docker container includes automatic health checks:

```bash
# Check Docker container health status
npm run docker:health

# View detailed health check logs
docker logs <container-name>

# Manual health check inside container
docker exec <container-name> curl -f http://localhost:3000/api/health
```

### Docker Health Check Configuration

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

- **Interval**: 30 seconds between checks
- **Timeout**: 10 seconds timeout per check
- **Start Period**: 5 seconds grace period on container start
- **Retries**: 3 consecutive failures before marking unhealthy

## Monitoring Integration

### HTTP Status Monitoring

Monitor the health endpoint using HTTP status codes:

```bash
# Example monitoring script
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
if [ $response -eq 200 ]; then
    echo "✅ Application is healthy"
else
    echo "❌ Application is unhealthy (HTTP $response)"
fi
```

### Kubernetes Probes

Example Kubernetes configuration:

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  
readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Load Balancer Health Checks

Configure your load balancer to use the health endpoint:

- **Health Check URL**: `http://your-domain:3000/api/health`
- **Expected Status**: 200
- **Check Interval**: 30 seconds
- **Unhealthy Threshold**: 3 consecutive failures

## Troubleshooting

### Common Issues

1. **503 Service Unavailable**
   - Check application logs for errors
   - Verify all dependencies are available
   - Check modbus service connectivity

2. **Timeout Issues**
   - Increase health check timeout
   - Check network connectivity
   - Monitor application performance

3. **Container Health Check Failures**
   - Verify curl is available in container
   - Check port binding (3000)
   - Review container logs

### Debug Commands

```bash
# Check if application is running
curl -I http://localhost:3000/api/health

# Detailed health status
curl -s http://localhost:3000/api/health | jq '.'

# Monitor continuous health checks
watch -n 5 'curl -s http://localhost:3000/api/health | jq ".status"'
```

## Extension Points

The health check system can be extended to monitor additional services:

1. **Database Connectivity**: Add database connection checks
2. **External API Dependencies**: Monitor third-party service availability
3. **Resource Usage**: Include memory/CPU metrics
4. **Custom Business Logic**: Add application-specific health validations

Example of extending the modbus health check:

```typescript
async function checkModbusHealth(): Promise<'healthy' | 'unhealthy' | 'unknown'> {
  try {
    // Add actual modbus connection test
    const client = new ModBusRTU();
    await client.connectTCP('192.168.1.100', { port: 502 });
    await client.readHoldingRegisters(0, 1);
    client.close();
    return 'healthy';
  } catch (error) {
    console.error('Modbus health check failed:', error);
    return 'unhealthy';
  }
}
```