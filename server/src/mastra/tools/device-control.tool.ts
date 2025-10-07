import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { ControlCommand } from '../../shared';
import { deviceStore } from '../stores/device.store';

/**
 * Tool for controlling IoT devices (turn on/off, adjust settings)
 */
export const deviceControlTool = createTool({
  id: 'device-control',
  description: 'Control IoT devices by sending commands like turn on/off, set temperature, adjust speed, or set brightness. Use this to execute control actions on registered devices.',
  inputSchema: z.object({
    deviceId: z.string().describe('The ID of the device to control'),
    action: z.enum(['turn_on', 'turn_off', 'set_temperature', 'set_speed', 'set_brightness']).describe('The control action to perform'),
    parameters: z.record(z.any()).optional().describe('Additional parameters for the action (e.g., temperature value, speed level)'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    command: z.any().optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { deviceId, action, parameters } = context;

    try {
      // Check if device exists
      const device = await deviceStore.getDevice(deviceId);
      if (!device) {
        return {
          success: false,
          error: `Device ${deviceId} not found`,
        };
      }

      // Check if device is online
      if (device.status !== 'online') {
        return {
          success: false,
          error: `Device ${deviceId} is ${device.status} and cannot accept commands`,
        };
      }

      // Create control command
      const command: ControlCommand = {
        deviceId,
        action,
        parameters,
        timestamp: new Date().toISOString(),
      };

      // Update device metadata to reflect the command
      const updatedMetadata = {
        ...(device.metadata || {}),
        lastCommand: command,
        state: action === 'turn_on' ? 'on' : action === 'turn_off' ? 'off' : device.metadata?.state || 'unknown',
      };

      if (parameters) {
        Object.assign(updatedMetadata, parameters);
      }

      await deviceStore.updateDevice(deviceId, {
        metadata: updatedMetadata,
        lastActivity: new Date().toISOString(),
      });

      // In a real system, this would send the command via MQTT or WebSocket
      // For now, we'll just update the device state

      return {
        success: true,
        command,
        message: `Command "${action}" sent to device "${device.name}" successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while controlling device',
      };
    }
  },
});
