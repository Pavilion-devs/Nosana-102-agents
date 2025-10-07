import { z } from 'zod';

/**
 * Device Types
 */
export enum DeviceType {
  SMART_PLUG = 'smart_plug',
  TEMPERATURE_SENSOR = 'temperature_sensor',
  HUMIDITY_SENSOR = 'humidity_sensor',
  FAN = 'fan',
  AC = 'ac',
  LIGHT = 'light',
  MOTION_SENSOR = 'motion_sensor',
  POWER_MONITOR = 'power_monitor',
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
}

/**
 * Device Schema
 */
export const DeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(DeviceType),
  status: z.nativeEnum(DeviceStatus),
  location: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  lastActivity: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Device = z.infer<typeof DeviceSchema>;

/**
 * Telemetry Data Schema
 */
export const TelemetryDataSchema = z.object({
  deviceId: z.string(),
  timestamp: z.string().datetime(),
  data: z.record(z.union([z.string(), z.number(), z.boolean()])),
});

export type TelemetryData = z.infer<typeof TelemetryDataSchema>;

/**
 * Device Control Command Schema
 */
export const ControlCommandSchema = z.object({
  deviceId: z.string(),
  action: z.enum(['turn_on', 'turn_off', 'set_temperature', 'set_speed', 'set_brightness']),
  parameters: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
});

export type ControlCommand = z.infer<typeof ControlCommandSchema>;

/**
 * Automation Rule Schema
 */
export const AutomationRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  enabled: z.boolean(),
  conditions: z.array(z.object({
    deviceId: z.string(),
    metric: z.string(),
    operator: z.enum(['gt', 'lt', 'eq', 'gte', 'lte', 'ne']),
    value: z.union([z.string(), z.number(), z.boolean()]),
  })),
  actions: z.array(ControlCommandSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AutomationRule = z.infer<typeof AutomationRuleSchema>;

/**
 * WebSocket Message Types
 */
export enum WSMessageType {
  DEVICE_UPDATE = 'device_update',
  TELEMETRY = 'telemetry',
  COMMAND = 'command',
  COMMAND_RESULT = 'command_result',
  AUTOMATION_TRIGGERED = 'automation_triggered',
  ERROR = 'error',
}

export const WSMessageSchema = z.object({
  type: z.nativeEnum(WSMessageType),
  payload: z.any(),
  timestamp: z.string().datetime(),
});

export type WSMessage = z.infer<typeof WSMessageSchema>;

/**
 * API Response Types
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * User Types
 */
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;
