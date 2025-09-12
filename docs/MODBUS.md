# Modbus Protocol Documentation

## Modbus Function Codes

### Read Functions

| Function Code | Name | Description | Data Type |
|---------------|------|-------------|-----------|
| 01 | Read Coils | Read 1-2000 contiguous coils status | Boolean |
| 02 | Read Discrete Inputs | Read 1-2000 contiguous discrete inputs | Boolean |
| 03 | Read Holding Registers | Read 1-125 contiguous holding registers | 16-bit |
| 04 | Read Input Registers | Read 1-125 contiguous input registers | 16-bit |

### Write Functions

| Function Code | Name | Description | Data Type |
|---------------|------|-------------|-----------|
| 05 | Write Single Coil | Write single coil | Boolean |
| 06 | Write Single Register | Write single holding register | 16-bit |
| 15 | Write Multiple Coils | Write multiple coils | Boolean |
| 16 | Write Multiple Registers | Write multiple holding registers | 16-bit |

## LGS Grid Mapping

### Grid Layout (9x9)

```
    1   2   3   4   5   6   7   8   9
1  [11][12][13][14][15][16][17][18][19]
2  [21][22][23][24][25][26][27][28][29]
3  [31][32][33][34][35][36][37][38][39]
4  [41][42][43][44][45][46][47][48][49]
5  [51][52][53][54][55][56][57][58][59]
6  [61][62][63][64][65][66][67][68][69]
7  [71][72][73][74][75][76][77][78][79]
8  [81][82][83][84][85][86][87][88][89]
9  [91][92][93][94][95][96][97][98][99]
```

### Unit ID Calculation

- **Formula**: `Unit ID = Row * 10 + Column`
- **Example**: Row 3, Column 5 = Unit ID 35
- **Range**: 11-99 (excludes x0 positions)

### Address Mapping

#### Coils (Function Code 01, 05)
- **Address Range**: 0-63 (64 LEDs per unit)
- **Usage**: LED on/off control
- **Value**: `True` = LED On, `False` = LED Off

#### Holding Registers (Function Code 03, 06)
- **Address 0**: LED brightness (0-255)
- **Address 1**: LED color (RGB packed)
- **Address 2**: Animation mode
- **Address 3**: Animation speed

#### Input Registers (Function Code 04)
- **Address 0**: Temperature sensor
- **Address 1**: Light sensor
- **Address 2**: Status register
- **Address 3**: Error code

## Communication Parameters

### TCP/IP Settings
- **Default Port**: 502
- **Timeout**: 5 seconds
- **Connection Type**: TCP/IP
- **Protocol**: Modbus TCP

### Data Limits
- **Max Coils per Read**: 125
- **Max Registers per Read**: 125
- **Unit ID Range**: 1-255
- **Address Range**: 0-65535
- **Register Value Range**: 0-65535

## Error Codes

| Code | Description |
|------|-------------|
| 01 | Illegal Function |
| 02 | Illegal Data Address |
| 03 | Illegal Data Value |
| 04 | Slave Device Failure |
| 05 | Acknowledge |
| 06 | Slave Device Busy |
| 08 | Memory Parity Error |
| 10 | Gateway Path Unavailable |
| 11 | Gateway Target Failed |

## Testing Scenarios

### Basic Connectivity
1. Connect to Modbus server
2. Read status register
3. Verify connection

### LED Control
1. Write coil to turn LED on
2. Read coil to verify status
3. Write coil to turn LED off

### Grid Testing
1. Test each unit ID (11-99)
2. Test all 64 LEDs per unit
3. Verify grid position mapping

### Error Handling
1. Test invalid unit ID
2. Test invalid address
3. Test connection timeout
4. Test disconnection recovery
