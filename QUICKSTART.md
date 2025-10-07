# NEXUS IoT - Quick Start Guide

Get the NEXUS AI IoT application running in 3 minutes!

## Prerequisites

- Node.js v20.0+
- pnpm installed (`npm install -g pnpm`)
- OpenAI API key (or Anthropic/Google)

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
# Server configuration
cd server
cp .env.example .env
```

Edit `server/.env` and add your API key:
```env
OPENAI_API_KEY=sk-your-key-here
```

### 3. Start the Application

```bash
# From project root
pnpm dev
```

This starts both:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:3000`

## Verify Installation

### Test the Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Get devices
curl http://localhost:3001/api/devices

# Chat with AI agent
curl -X POST http://localhost:3001/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "List all my devices"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "text": "You have 8 devices: Living Room Temp Sensor, ...",
    "conversationId": "conv_123"
  }
}
```

## What You Get Out of the Box

### 🎯 8 Pre-configured Demo Devices

1. **Living Room Temp Sensor** - Simulates temperature
2. **Living Room Humidity Sensor** - Simulates humidity
3. **Ceiling Fan** - Controllable fan with speed settings
4. **Air Conditioner** - Temperature control device
5. **Living Room Light** - Brightness control
6. **Smart Plug** - Power monitoring
7. **Motion Detector** - Motion sensing
8. **Power Monitor** - Energy consumption tracking

### 🤖 AI Agent Capabilities

Ask the NEXUS agent:
- "What devices do I have?"
- "What's the temperature in the living room?"
- "Turn on the ceiling fan"
- "Set the AC to 22 degrees"
- "Show me power consumption"

### 📡 Real-time Updates

- Telemetry data updates every 5 seconds
- WebSocket connection on `ws://localhost:3001/ws`
- Live device state synchronization

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health |
| `/api/devices` | GET | List all devices |
| `/api/devices/:id` | GET | Get device details |
| `/api/devices/:id/telemetry` | GET | Get device data |
| `/api/agent/chat` | POST | Chat with agent |
| `/api/agent/stream` | POST | Stream responses |

## Development Commands

```bash
# Start everything
pnpm dev

# Start only backend
pnpm dev:server

# Start only frontend
pnpm dev:frontend

# Type checking
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## Project Structure

```
nosana-iot/
├── server/         # Backend with Mastra AI
├── frontend/       # Next.js dashboard
├── shared/         # Shared types
└── pnpm-workspace.yaml
```

## Next Steps

1. **Build Dashboard UI** - Create device cards and charts
2. **Add WebSocket** - Connect frontend to real-time updates
3. **Implement Auth** - Add Supabase authentication
4. **Deploy** - Ship to Nosana Network + Vercel

## Troubleshooting

### "Module not found @nexus/shared"
```bash
pnpm install
```

### "Agent not responding"
- Verify API key in `server/.env`
- Check OpenAI account credits

### "Port already in use"
```bash
# Change port in server/.env
PORT=3002
```

## Support

- 📖 Full docs: See `SETUP.md`
- 📊 Project status: See `STATUS.md`
- 📋 PRD: See `prd.txt`

---

🚀 **Ready to build!** The backend is fully functional and waiting for the frontend dashboard.
