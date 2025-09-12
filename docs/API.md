# API Documentation

## Modbus API Endpoints

### Base URL
```
http://localhost:3000/api/modbus
```

## Endpoints

### GET /api/modbus
Get connection status

#### Response
```json
{
  "success": true,
  "connected": true,
  "message": "Connected"
}
```

### POST /api/modbus
Execute Modbus command

#### Request Body
```json
{
  "action": "connect|disconnect|readCoils|readDiscreteInputs|readHoldingRegisters|readInputRegisters|writeCoil|writeRegister|status",
  "host": "string (required for connect)",
  "port": "number (optional, default: 502)",
  "unitId": "number (1-255)",
  "address": "number (0-65535)",
  "quantity": "number (1-125, optional)",
  "value": "string|number|boolean (required for write operations)"
}
```

## Actions

### connect
Connect to Modbus TCP server

#### Request
```json
{
  "action": "connect",
  "host": "192.168.1.100",
  "port": 502
}
```

#### Response
```json
{
  "success": true,
  "message": "Connected to 192.168.1.100:502",
  "connected": true
}
```

### disconnect
Disconnect from Modbus server

#### Request
```json
{
  "action": "disconnect"
}
```

#### Response
```json
{
  "success": true,
  "message": "Disconnected",
  "connected": false
}
```

### readCoils
Read coil status (Function Code 01)

#### Request
```json
{
  "action": "readCoils",
  "unitId": 35,
  "address": 0,
  "quantity": 8
}
```

#### Response
```json
{
  "success": true,
  "data": [true, false, true, false, true, false, true, false],
  "message": "Read 8 coils from address 0"
}
```

### readDiscreteInputs
Read discrete inputs (Function Code 02)

#### Request
```json
{
  "action": "readDiscreteInputs",
  "unitId": 35,
  "address": 0,
  "quantity": 4
}
```

#### Response
```json
{
  "success": true,
  "data": [true, true, false, false],
  "message": "Read 4 discreteinputs from address 0"
}
```

### readHoldingRegisters
Read holding registers (Function Code 03)

#### Request
```json
{
  "action": "readHoldingRegisters",
  "unitId": 35,
  "address": 0,
  "quantity": 2
}
```

#### Response
```json
{
  "success": true,
  "data": [255, 128],
  "message": "Read 2 holdingregisters from address 0"
}
```

### readInputRegisters
Read input registers (Function Code 04)

#### Request
```json
{
  "action": "readInputRegisters",
  "unitId": 35,
  "address": 0,
  "quantity": 3
}
```

#### Response
```json
{
  "success": true,
  "data": [1024, 2048, 512],
  "message": "Read 3 inputregisters from address 0"
}
```

### writeCoil
Write single coil (Function Code 05)

#### Request
```json
{
  "action": "writeCoil",
  "unitId": 35,
  "address": 0,
  "value": true
}
```

#### Response
```json
{
  "success": true,
  "message": "Written true to coil at address 0"
}
```

### writeRegister
Write single register (Function Code 06)

#### Request
```json
{
  "action": "writeRegister",
  "unitId": 35,
  "address": 0,
  "value": 255
}
```

#### Response
```json
{
  "success": true,
  "message": "Written 255 to register at address 0"
}
```

### status
Get current connection status

#### Request
```json
{
  "action": "status"
}
```

#### Response
```json
{
  "success": true,
  "connected": true,
  "message": "Connected"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Unit ID must be between 1 and 255"
}
```

### Connection Error (500)
```json
{
  "success": false,
  "error": "Failed to connect: ECONNREFUSED"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Unknown error occurred"
}
```

## Value Formats

### Boolean Values
- **True**: `true`, `"true"`, `"1"`, `"on"`
- **False**: `false`, `"false"`, `"0"`, `"off"`

### Number Values
- **Range**: 0-65535 for registers
- **Format**: Integer only

### String Values
- **Coils**: Converted to boolean
- **Registers**: Parsed as integer

## Rate Limiting

No rate limiting currently implemented, but recommended:
- **Max requests per second**: 10
- **Max concurrent connections**: 5
- **Timeout**: 5 seconds

## HTTP Status Codes

- **200**: Success
- **400**: Bad Request (validation error)
- **500**: Internal Server Error (connection/modbus error)

## Examples with cURL

### Connect
```bash
curl -X POST http://localhost:3000/api/modbus \
  -H "Content-Type: application/json" \
  -d '{"action": "connect", "host": "192.168.1.100", "port": 502}'
```

### Read Coils
```bash
curl -X POST http://localhost:3000/api/modbus \
  -H "Content-Type: application/json" \
  -d '{"action": "readCoils", "unitId": 35, "address": 0, "quantity": 8}'
```

### Write Coil
```bash
curl -X POST http://localhost:3000/api/modbus \
  -H "Content-Type: application/json" \
  -d '{"action": "writeCoil", "unitId": 35, "address": 0, "value": true}'
```

### Get Status
```bash
curl -X GET http://localhost:3000/api/modbus
```
