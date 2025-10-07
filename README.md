# NEXUS - AI Agent for IoT Device Monitoring & Control

A production-ready AI agent application that provides real-time control and monitoring for IoT devices through a Next.js dashboard powered by the Model Context Protocol (MCP) and Mastra AI framework.

## Project Structure

```
nosana-iot/
├── server/              # Backend API and Mastra AI agent
├── frontend/            # Next.js dashboard
├── mcp-server/          # MCP server with IoT tools
├── shared/              # Shared types and utilities
└── prd.txt             # Product Requirements Document
```

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, React Query, Framer Motion
- **AI Agent**: Mastra AI Framework, OpenAI/Anthropic/Gemini
- **Protocol**: Model Context Protocol (MCP)
- **Backend**: Node.js + TypeScript
- **Database**: Supabase
- **Real-time**: WebSocket, Redis PubSub
- **IoT Simulation**: MQTT (Mosquitto)

## Getting Started

### Prerequisites

- Node.js v20.0 or higher
- pnpm (recommended) or npm
- API key from OpenAI, Anthropic, or Google Gemini
- Supabase account (for authentication)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables (see `.env.example` in each folder)

4. Start development servers:
   ```bash
   # Start backend
   cd server && pnpm dev

   # Start frontend
   cd frontend && pnpm dev

   # Start MCP server
   cd mcp-server && pnpm dev
   ```

## Features

- 🎯 Real-time IoT device monitoring
- 🤖 AI-powered device control
- 📊 Dynamic dashboard with live data visualization
- 🔄 Instant UI sync with device state changes
- 🔧 MCP tools for device management
- 🔐 Secure authentication
- ⚡ WebSocket-based real-time updates

## MCP Tools

1. **DeviceManagerTool** - Add, remove, and list registered devices
2. **DeviceControlTool** - Send control commands to devices
3. **TelemetryTool** - Stream sensor readings in real time
4. **AutomationTool** - Manage automation rules

## Development

See individual README files in each folder for detailed setup instructions:
- [Server Setup](./server/README.md)
- [Frontend Setup](./frontend/README.md)
- [MCP Server Setup](./mcp-server/README.md)

## License

MIT
