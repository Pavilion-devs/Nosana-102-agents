import { Mastra } from '@mastra/core/mastra';
import { MCPServer } from '@mastra/mcp';
import { nexusAgent } from './agents/nexus-agent';
import { deviceManagerTool } from './tools/device-manager.tool';
import { deviceControlTool } from './tools/device-control.tool';
import { telemetryTool } from './tools/telemetry.tool';

/**
 * MCP Server for NEXUS IoT tools
 */
export const nexusMcpServer = new MCPServer({
  id: 'nexus-mcp-server',
  name: 'NEXUS IoT MCP Server',
  version: '1.0.0',
  agents: { nexusAgent },
  tools: {
    deviceManagerTool,
    deviceControlTool,
    telemetryTool,
  },
});

/**
 * Main Mastra instance
 */
export const mastra = new Mastra({
  agents: { nexusAgent },
  mcpServers: { nexusMcpServer },
});
