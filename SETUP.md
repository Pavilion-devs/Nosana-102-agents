# NEXUS IoT - Setup Guide

## Project Overview

NEXUS is a production-ready AI agent application for real-time IoT device monitoring and control, built with:
- **Mastra AI Framework** - Agent orchestration and MCP tools
- **Next.js** - Frontend dashboard
- **Express + WebSocket** - Real-time backend
- **TypeScript** - Full-stack type safety

## Project Structure

```
nosana-iot/
├── server/              # Backend with Mastra AI & Express
│   ├── src/
│   │   ├── mastra/
│   │   │   ├── agents/       # NEXUS AI Agent
│   │   │   ├── tools/        # MCP Tools (DeviceManager, DeviceControl, Telemetry)
│   │   │   ├── stores/       # In-memory data stores
│   │   │   └── index.ts      # Mastra configuration
│   │   ├── server/
│   │   │   ├── routes.ts     # REST API endpoints
│   │   │   └── websocket.ts  # WebSocket manager
│   │   ├── simulator/
│   │   │   ├── device-simulator.ts  # IoT simulator
│   │   │   └── seed-devices.ts      # Demo devices
│   │   └── index.ts          # Server entry point
│   └── package.json
├── frontend/            # Next.js dashboard
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   └── package.json
├── shared/              # Shared types & schemas
│   └── src/
│       └── types.ts     # Device, Telemetry, Command types
└── package.json         # Monorepo root
```

## Installation

### 1. Install Dependencies

```bash
# Install all packages in the monorepo
pnpm install
```

### 2. Configure Environment Variables

#### Server (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
# Add your OpenAI API key (or Anthropic/Google)
OPENAI_API_KEY=sk-your-api-key-here

# Server config (defaults are fine for dev)
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)
```bash
cd frontend
cp .env.local.example .env.local
```

The defaults should work for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Servers

#### Option A: Start All Services Together
```bash
# From project root
pnpm dev
```

#### Option B: Start Services Separately

```bash
# Terminal 1: Backend server
cd server
pnpm dev

# Terminal 2: Frontend
cd frontend
pnpm dev
```

## Features Implemented

### ✅ Completed

1. **Mastra AI Framework Integration**
   - NEXUS AI Agent with natural language understanding
   - Three MCP Tools:
     - `DeviceManagerTool` - Add, remove, list devices
     - `DeviceControlTool` - Send control commands
     - `TelemetryTool` - Retrieve sensor data

2. **Backend Server**
   - Express REST API
   - WebSocket for real-time updates
   - IoT device simulator
   - 8 pre-seeded demo devices:
     - Temperature sensors
     - Humidity sensors
     - Smart plugs
     - Fans, AC units
     - Lights
     - Motion sensors
     - Power monitors

3. **Shared Types**
   - Type-safe schemas with Zod
   - Shared across frontend & backend

4. **Frontend Foundation**
   - Next.js 15 with App Router
   - TailwindCSS with dark theme
   - React Query for data fetching
   - Framer Motion ready for animations

### 🚧 To Be Completed

5. **Frontend Dashboard UI**
   - Device cards with live status
   - Real-time charts (Recharts)
   - Chat interface with AI agent
   - Control panel for devices

6. **Real-Time Sync**
   - WebSocket integration in frontend
   - Live telemetry updates
   - Instant device state sync

7. **Authentication**
   - Supabase integration
   - Protected routes

## API Endpoints

### Devices
- `GET /api/devices` - List all devices
- `GET /api/devices/:id` - Get device details
- `GET /api/devices/:id/telemetry` - Get device telemetry

### AI Agent
- `POST /api/agent/chat` - Chat with NEXUS agent
- `POST /api/agent/stream` - Stream agent responses (SSE)

### Health
- `GET /api/health` - Server status

## MCP Tools Usage

The NEXUS agent can use these tools automatically:

```typescript
// Example: User asks "What devices do I have?"
// Agent calls: deviceManagerTool({ action: 'list' })

// Example: User asks "Turn on the fan in living room"
// Agent calls: deviceControlTool({
//   deviceId: 'device_fan_001',
//   action: 'turn_on'
// })

// Example: User asks "What's the temperature?"
// Agent calls: telemetryTool({
//   action: 'get_latest',
//   deviceId: 'device_temp_001'
// })
```

## Next Steps

1. **Complete Frontend Dashboard**
   - Build device cards component
   - Add charts for telemetry visualization
   - Create chat interface

2. **WebSocket Integration**
   - Connect frontend to WebSocket
   - Subscribe to device updates
   - Display real-time data

3. **Authentication**
   - Set up Supabase project
   - Add auth components
   - Protect API routes

4. **Testing**
   - Add unit tests
   - Integration tests
   - E2E tests with Playwright

5. **Deployment**
   - Deploy backend to Nosana Network
   - Deploy frontend to Vercel
   - Configure production environment

## Development Tips

- **Monorepo**: All packages share dependencies via pnpm workspaces
- **Type Safety**: Changes to `shared/` types auto-update in server & frontend
- **Hot Reload**: Both server and frontend support hot module replacement
- **Mastra Dev**: Run `pnpm dev` in server to access Mastra Playground

## Troubleshooting

### Issue: "Module not found @nexus/shared"
```bash
# Reinstall dependencies
pnpm install
```

### Issue: "Agent not responding"
- Check your API key in `server/.env`
- Verify OpenAI API quota/credits

### Issue: "WebSocket connection failed"
- Ensure backend is running on port 3001
- Check CORS configuration

## Resources

- [Mastra AI Docs](https://mastra.ai/en/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## License

MIT
