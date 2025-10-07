import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { TelemetryData } from '../../shared';
import { deviceStore } from '../stores/device.store';

/**
 * In-memory telemetry store
 * In production, this would use a time-series database
 */
class TelemetryStore {
  private telemetry: Map<string, TelemetryData[]> = new Map();
  private readonly MAX_RECORDS_PER_DEVICE = 1000;

  addTelemetry(data: TelemetryData): void {
    const deviceTelemetry = this.telemetry.get(data.deviceId) || [];
    deviceTelemetry.push(data);

    // Keep only the last MAX_RECORDS_PER_DEVICE records
    if (deviceTelemetry.length > this.MAX_RECORDS_PER_DEVICE) {
      deviceTelemetry.shift();
    }

    this.telemetry.set(data.deviceId, deviceTelemetry);
  }

  getTelemetry(deviceId: string, limit?: number): TelemetryData[] {
    const deviceTelemetry = this.telemetry.get(deviceId) || [];
    if (limit) {
      return deviceTelemetry.slice(-limit);
    }
    return deviceTelemetry;
  }

  getLatestTelemetry(deviceId: string): TelemetryData | undefined {
    const deviceTelemetry = this.telemetry.get(deviceId) || [];
    return deviceTelemetry[deviceTelemetry.length - 1];
  }
}

export const telemetryStore = new TelemetryStore();

/**
 * Tool for retrieving and managing device telemetry data
 */
export const telemetryTool = createTool({
  id: 'telemetry',
  description: 'Get real-time telemetry data from IoT devices including temperature, humidity, power consumption, and other sensor readings. Use this to monitor device metrics.',
  inputSchema: z.object({
    action: z.enum(['get_latest', 'get_history', 'get_summary']).describe('The type of telemetry data to retrieve'),
    deviceId: z.string().describe('The ID of the device'),
    limit: z.number().optional().describe('Number of historical records to retrieve (for get_history)'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { action, deviceId, limit } = context;

    try {
      // Check if device exists
      const device = await deviceStore.getDevice(deviceId);
      if (!device) {
        return {
          success: false,
          error: `Device ${deviceId} not found`,
        };
      }

      switch (action) {
        case 'get_latest': {
          const latest = telemetryStore.getLatestTelemetry(deviceId);
          if (!latest) {
            return {
              success: false,
              error: `No telemetry data available for device ${deviceId}`,
            };
          }

          return {
            success: true,
            data: latest,
            message: `Latest telemetry for device "${device.name}"`,
          };
        }

        case 'get_history': {
          const history = telemetryStore.getTelemetry(deviceId, limit || 10);
          return {
            success: true,
            data: history,
            message: `Retrieved ${history.length} telemetry record(s) for device "${device.name}"`,
          };
        }

        case 'get_summary': {
          const history = telemetryStore.getTelemetry(deviceId);
          if (history.length === 0) {
            return {
              success: false,
              error: `No telemetry data available for device ${deviceId}`,
            };
          }

          // Calculate basic statistics
          const summary = {
            deviceId,
            deviceName: device.name,
            recordCount: history.length,
            firstReading: history[0]?.timestamp,
            lastReading: history[history.length - 1]?.timestamp,
            latestData: history[history.length - 1]?.data,
          };

          return {
            success: true,
            data: summary,
            message: `Telemetry summary for device "${device.name}"`,
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
        error: error instanceof Error ? error.message : 'An error occurred while retrieving telemetry',
      };
    }
  },
});
