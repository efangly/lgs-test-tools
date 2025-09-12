# LGS Test Tools

เครื่องมือทดสอบระบบไฟ LED ผ่าน Modbus TCP สำหรับระบบ LGS (Light Grid System) ที่ใช้ในการควบคุมและทดสอบไฟ LED ในรูปแบบ Grid 9x9

## ✨ คุณสมบัติ

- 🔌 **เชื่อมต่อ Modbus TCP**: รองรับการเชื่อมต่อกับ Modbus TCP Server
- 💡 **ควบคุมไฟ LED**: สามารถควบคุมไฟ LED ในรูปแบบ Grid 9x9
- 📊 **อ่านข้อมูล**: รองรับการอ่าน Coils, Discrete Inputs, Holding Registers, Input Registers
- ✍️ **เขียนข้อมูล**: รองรับการเขียน Coils และ Registers
- 🎯 **UI สะดวกใช้**: Web Interface ที่ใช้งานง่าย
- 📱 **Responsive Design**: รองรับการใช้งานบนอุปกรณ์ต่างๆ
- 🌙 **Dark/Light Theme**: สลับธีมได้ตามใจชอบ

## 🚀 การติดตั้งและรัน

### วิธีที่ 1: การรันแบบ Development

#### ความต้องการของระบบ
- Node.js 18+ 
- npm หรือ yarn

#### ขั้นตอนการติดตั้ง

1. **Clone repository**
```bash
git clone <repository-url>
cd lgs-test-tools
```

2. **ติดตั้ง dependencies**
```bash
npm install
# หรือ
yarn install
```

3. **รันโปรแกรม**
```bash
npm run dev
# หรือ
yarn dev
```

4. **เปิดเว็บไซต์**
เปิด [http://localhost:3000](http://localhost:3000) ในเว็บเบราว์เซอร์

### วิธีที่ 2: การรันด้วย Docker

#### ความต้องการของระบบ
- Docker 20+
- Docker Compose (สำหรับใช้งานร่วมกับ Simulator)

#### รัน Application อย่างเดียว

```bash
# Build และรัน container
docker build -t lgs-test-tools .
docker run -p 3000:3000 lgs-test-tools
```

#### รันพร้อม Modbus Simulator

```bash
# รันทั้ง Application และ Simulator
docker-compose --profile simulator up -d

# รันเฉพาะ Application
docker-compose up -d
```

## 🎯 การใช้งาน

### การเชื่อมต่อ Modbus

1. **เข้าสู่หน้าเว็บ**: เปิด [http://localhost:3000](http://localhost:3000)
2. **กรอกข้อมูลการเชื่อมต่อ**:
   - **Host**: IP Address ของ Modbus Server (เช่น `192.168.1.100`)
   - **Port**: Port ของ Modbus Server (ปกติคือ `502`)
3. **คลิกปุ่ม "Connect"**: เพื่อเชื่อมต่อกับ Modbus Server

### การควบคุมไฟ LED

#### แบบ Grid Position
1. **เลือกตำแหน่ง**:
   - **Row**: แถว (1-9)
   - **Column**: คอลัมน์ (1-9)
   - **LED**: หมายเลข LED (1-64)

2. **ควบคุมไฟ**:
   - **Turn On**: เปิดไฟ LED
   - **Turn Off**: ปิดไฟ LED

#### แบบ Unit ID
1. **กรอก Unit ID**: หมายเลข Unit ID (1-255)
2. **เลือกการทำงาน**: เปิด/ปิดไฟ

### การทดสอบ Modbus Functions

#### Read Operations
- **Read Coils**: อ่านสถานะ Coils
- **Read Discrete Inputs**: อ่านสถานะ Discrete Inputs  
- **Read Holding Registers**: อ่านค่า Holding Registers
- **Read Input Registers**: อ่านค่า Input Registers

#### Write Operations
- **Write Coil**: เขียนค่า Coil (True/False)
- **Write Register**: เขียนค่า Register (0-65535)

### พารามิเตอร์ Modbus

- **Unit ID**: 1-255 (Slave Address)
- **Address**: 0-65535 (Register/Coil Address)
- **Quantity**: 1-125 (จำนวนข้อมูลที่อ่าน)
- **Value**: ข้อมูลที่ต้องการเขียน

## 🏗️ สถาปัตยกรรม

### โครงสร้างโปรเจค

```
lgs-test-tools/
├── app/                    # Next.js App Router
│   ├── api/modbus/        # Modbus API endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/                # UI components
│   ├── ConnectionStatus.tsx
│   ├── LightPanel.tsx
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── modbus-service.ts  # Modbus service class
│   └── utils.ts           # Helper utilities
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── constants/             # Application constants
```

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Modbus**: modbus-serial library
- **State Management**: React Context API
- **Build Tool**: Next.js built-in bundler
- **Container**: Docker, Docker Compose

## 🔧 การกำหนดค่า

### Environment Variables

สร้างไฟล์ `.env.local` สำหรับการกำหนดค่า:

```env
# Application
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Modbus (ถ้าต้องการกำหนดค่าเริ่มต้น)
DEFAULT_MODBUS_HOST=192.168.1.100
DEFAULT_MODBUS_PORT=502
```

### Modbus Configuration

- **Timeout**: 5 วินาทีตามค่าเริ่มต้น
- **Max Retries**: 3 ครั้ง
- **Connection Type**: TCP/IP
- **Protocol**: Modbus TCP

## 📊 การตรวจสอบสถานะ

### Health Check

- **Endpoint**: `GET /api/modbus`
- **Response**: สถานะการเชื่อมต่อ Modbus

```json
{
  "success": true,
  "connected": true,
  "message": "Connected"
}
```

### Logs

- **Development**: แสดง debug logs ใน console
- **Production**: แสดงเฉพาะ error และ warning logs

## 🐛 การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อ

1. **ตรวจสอบ Network**:
   ```bash
   ping <modbus-server-ip>
   telnet <modbus-server-ip> 502
   ```

2. **ตรวจสอบ Firewall**: ให้แน่ใจว่า Port 502 เปิดใช้งาน

3. **ตรวจสอบ Modbus Server**: ให้แน่ใจว่า Modbus Server รันอยู่

### ปัญหา Docker

1. **Container ไม่เริ่มต้น**:
   ```bash
   docker logs lgs-test-tools
   ```

2. **Network Issues**:
   ```bash
   docker network ls
   docker network inspect modbus-network
   ```

### ปัญหาการพัฒนา

1. **TypeScript Errors**: รัน `npm run type-check`
2. **Lint Errors**: รัน `npm run lint`
3. **Build Errors**: รัน `npm run build`

## 🚀 การ Deploy

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Production

```bash
# Build production image
docker build -t lgs-test-tools:latest .

# Run with production settings
docker run -d \
  --name lgs-test-tools \
  -p 3000:3000 \
  -e NODE_ENV=production \
  lgs-test-tools:latest
```

## 🤝 การพัฒนา

### Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

### Code Structure Guidelines

- **Components**: แยกเป็น UI components และ business logic
- **Services**: ใช้ Service classes สำหรับ business logic
- **Types**: กำหนด TypeScript types ที่ชัดเจน
- **Error Handling**: ใช้ try-catch และ validation
- **Logging**: ใช้ Logger utility

## 📄 License

MIT License - ดูรายละเอียดในไฟล์ LICENSE

## 📞 Support

สำหรับคำถามและการสนับสนุน:
- Email: support@example.com
- Issues: GitHub Issues
- Documentation: README.md
