# NEXUS IoT Server

Backend server for the NEXUS AI Agent application, built with Mastra AI framework, Express, and WebSocket for real-time IoT device monitoring and control.

## Features

- 🤖 Mastra AI Agent for intelligent device management
- 🔧 MCP (Model Context Protocol) tools for IoT operations
- 📡 Real-time WebSocket communication
- 🎲 IoT device simulator for demo purposes
- 📊 Telemetry data collection and streaming

## Prerequisites

- Node.js v20.0 or higher
- pnpm (recommended) or npm
- API key from OpenAI, Anthropic, or Google Gemini

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env` file from the example:
```bash
cp .env.example .env
```

3. Add your API key to `.env`:
```env
OPENAI_API_KEY=your_api_key_here
```

## Development

Start the development server:
```bash
pnpm dev
```

The server will start on `http://localhost:3001` with:
- HTTP API at `/api`
- WebSocket at `/ws`
- Health check at `/api/health`

## API Endpoints

### Devices

- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device by ID
- `GET /api/devices/:id/telemetry?limit=10` - Get device telemetry

### Agent

- `POST /api/agent/chat` - Chat with NEXUS agent
  ```json
  {
    "message": "What's the temperature in the living room?",
    "conversationId": "conv_123"
  }
  ```

- `POST /api/agent/stream` - Stream agent responses (SSE)

### Health

- `GET /api/health` - Server health check

## MCP Tools

The server implements three MCP tools:

1. **DeviceManagerTool** - Manage devices (add, remove, list, get)
2. **DeviceControlTool** - Control devices (turn on/off, adjust settings)
3. **TelemetryTool** - Get device telemetry data

## Project Structure

```
server/
├── src/
│   ├── mastra/
│   │   ├── agents/          # AI agents
│   │   ├── tools/           # MCP tools
│   │   ├── stores/          # Data stores
│   │   └── index.ts         # Mastra config
│   ├── server/
│   │   ├── routes.ts        # API routes
│   │   └── websocket.ts     # WebSocket manager
│   ├── simulator/
│   │   ├── device-simulator.ts
│   │   └── seed-devices.ts
│   └── index.ts             # Entry point
├── package.json
└── tsconfig.json
```

## Environment Variables

See `.env.example` for all available configuration options.

## Building for Production

```bash
pnpm build
pnpm start
```

## License

MIT
