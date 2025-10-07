# NEXUS IoT - Quick Testing Guide

## 🚀 Start the Server

```bash
cd server
pnpm dev
```

Server will start on `http://localhost:3001`

---

## 🧪 Test Commands

### 1. Health Check
```bash
curl http://localhost:3001/api/health | jq
```

### 2. List All Devices
```bash
curl http://localhost:3001/api/devices | jq
```

### 3. Get Specific Device
```bash
curl http://localhost:3001/api/devices/device_temp_001 | jq
```

### 4. Get Device Telemetry
```bash
curl "http://localhost:3001/api/devices/device_temp_001/telemetry?limit=5" | jq
```

### 5. Chat with AI Agent - List Devices
```bash
curl -X POST http://localhost:3001/api/agent/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"List all my devices"}' | jq
```

### 6. Chat with AI Agent - Get Temperature
```bash
curl -X POST http://localhost:3001/api/agent/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"What is the temperature in the living room?"}' | jq '.data.text'
```

### 7. Chat with AI Agent - Get Humidity
```bash
curl -X POST http://localhost:3001/api/agent/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"What is the humidity level?"}' | jq '.data.text'
```

### 8. Chat with AI Agent - Device Status
```bash
curl -X POST http://localhost:3001/api/agent/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Show me all devices that are turned on"}' | jq '.data.text'
```

---

## 📊 Available Devices

| Device ID | Name | Type | Location |
|-----------|------|------|----------|
| `device_temp_001` | Living Room Temp Sensor | Temperature | Living Room |
| `device_humid_001` | Living Room Humidity Sensor | Humidity | Living Room |
| `device_fan_001` | Ceiling Fan | Fan | Living Room |
| `device_ac_001` | Air Conditioner | AC | Bedroom |
| `device_light_001` | Living Room Light | Light | Living Room |
| `device_plug_001` | Smart Plug 1 | Smart Plug | Office |
| `device_motion_001` | Motion Detector | Motion Sensor | Hallway |
| `device_power_001` | Power Monitor | Power Monitor | Main Panel |

---

## 🤖 AI Agent Examples

### Natural Language Queries
- "List all my devices"
- "What's the temperature in the living room?"
- "Show me power consumption"
- "Which devices are online?"
- "What's the humidity level?"
- "Tell me about device_fan_001"

### Device Control (requires confirmation)
- "Turn on device_fan_001"
- "Set the AC to 22 degrees"
- "Turn off the lights"

---

## 🔍 Monitoring Real-time Updates

### Watch Telemetry Updates
```bash
watch -n 1 'curl -s "http://localhost:3001/api/devices/device_temp_001/telemetry?limit=1" | jq'
```

### Monitor All Devices
```bash
watch -n 2 'curl -s http://localhost:3001/api/devices | jq ".data[] | {name, status, lastActivity}"'
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3001 is already in use
lsof -ti:3001 | xargs kill -9

# Try starting again
pnpm dev
```

### API not responding
```bash
# Check server logs
# Server should show:
# ✅ Demo devices initialized
# ✨ Server ready!
```

### Agent not responding correctly
```bash
# Verify your OpenAI API key
cat server/.env | grep OPENAI_API_KEY

# Should show: OPENAI_API_KEY=sk-...
```

---

## 📈 Expected Response Times

| Endpoint | Expected Time |
|----------|---------------|
| Health Check | < 100ms |
| Device List | < 200ms |
| Telemetry | < 200ms |
| AI Agent | 3-5 seconds |

---

## ✅ Success Indicators

When everything is working, you should see:
- ✅ 8 devices seeded
- ✅ Server running on port 3001
- ✅ WebSocket server on /ws
- ✅ Telemetry updating every 5 seconds
- ✅ AI agent responding with formatted text
- ✅ MCP tools being called automatically

---

**Need help?** Check `TEST_RESULTS.md` for detailed test results.
