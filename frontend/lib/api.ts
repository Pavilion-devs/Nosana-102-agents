const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'error';
  location?: string;
  metadata?: Record<string, any>;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryData {
  deviceId: string;
  timestamp: string;
  data: Record<string, string | number | boolean>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatMessage {
  text: string;
  conversationId: string;
}

// Fetch all devices
export async function fetchDevices(): Promise<Device[]> {
  const response = await fetch(`${API_URL}/devices`);
  const json: ApiResponse<Device[]> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to fetch devices');
  }

  return json.data;
}

// Fetch single device
export async function fetchDevice(deviceId: string): Promise<Device> {
  const response = await fetch(`${API_URL}/devices/${deviceId}`);
  const json: ApiResponse<Device> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to fetch device');
  }

  return json.data;
}

// Fetch device telemetry
export async function fetchTelemetry(
  deviceId: string,
  limit: number = 10
): Promise<TelemetryData[]> {
  const response = await fetch(
    `${API_URL}/devices/${deviceId}/telemetry?limit=${limit}`
  );
  const json: ApiResponse<TelemetryData[]> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to fetch telemetry');
  }

  return json.data;
}

// Chat with AI agent
export async function chatWithAgent(
  message: string,
  conversationId?: string
): Promise<ChatMessage> {
  const response = await fetch(`${API_URL}/agent/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, conversationId }),
  });

  const json: ApiResponse<ChatMessage> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to chat with agent');
  }

  return json.data;
}
