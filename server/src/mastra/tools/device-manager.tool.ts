import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { DeviceSchema, DeviceStatus, DeviceType } from '../../shared';
import { deviceStore } from '../stores/device.store';

/**
 * Tool for managing IoT devices (add, remove, list)
 */
export const deviceManagerTool = createTool({
  id: 'device-manager',
  description: 'Manage IoT devices - add, remove, list, and get device information. Use this tool to register new devices, remove existing ones, or query device status.',
  inputSchema: z.object({
    action: z.enum(['add', 'remove', 'list', 'get']).describe('The action to perform on devices'),
    deviceId: z.string().optional().describe('Device ID (required for get, remove)'),
    deviceData: z.object({
      name: z.string(),
      type: z.nativeEnum(DeviceType),
      location: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }).optional().describe('Device data (required for add action)'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { action, deviceId, deviceData } = context;

    try {
      switch (action) {
        case 'add': {
          if (!deviceData) {
            return {
              success: false,
              error: 'Device data is required for add action',
            };
          }

          const newDevice = await deviceStore.addDevice({
            id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: deviceData.name,
            type: deviceData.type,
            status: DeviceStatus.ONLINE,
            location: deviceData.location,
            metadata: deviceData.metadata,
            lastActivity: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          return {
            success: true,
            data: newDevice,
            message: `Device "${newDevice.name}" added successfully`,
          };
        }

        case 'remove': {
          if (!deviceId) {
            return {
              success: false,
              error: 'Device ID is required for remove action',
            };
          }

          await deviceStore.removeDevice(deviceId);
          return {
            success: true,
            message: `Device ${deviceId} removed successfully`,
          };
        }

        case 'list': {
          const devices = await deviceStore.getAllDevices();
          return {
            success: true,
            data: devices,
            message: `Found ${devices.length} device(s)`,
          };
        }

        case 'get': {
          if (!deviceId) {
            return {
              success: false,
              error: 'Device ID is required for get action',
            };
          }

          const device = await deviceStore.getDevice(deviceId);
          if (!device) {
            return {
              success: false,
              error: `Device ${deviceId} not found`,
            };
          }

          return {
            success: true,
            data: device,
          };
        }

        default:
          return {
            success: false,
            error: `Unknown action: ${action}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  },
});
