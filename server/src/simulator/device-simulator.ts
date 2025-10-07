import { DeviceType, TelemetryData, Device } from '../shared';
import { deviceStore } from '../mastra/stores/device.store';
import { telemetryStore } from '../mastra/tools/telemetry.tool';

/**
 * Simulates realistic IoT device telemetry data
 */
export class DeviceSimulator {
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();
  private baseTemperature = 25; // Base temperature in Celsius
  private baseHumidity = 50; // Base humidity percentage

  /**
   * Start simulating a device
   */
  startSimulation(device: Device, intervalMs: number = 5000): void {
    if (this.intervalIds.has(device.id)) {
      console.log(`Simulation already running for device ${device.id}`);
      return;
    }

    const intervalId = setInterval(() => {
      this.generateTelemetry(device);
    }, intervalMs);

    this.intervalIds.set(device.id, intervalId);
    console.log(`Started simulation for device: ${device.name} (${device.id})`);

    // Generate initial telemetry immediately
    this.generateTelemetry(device);
  }

  /**
   * Stop simulating a device
   */
  stopSimulation(deviceId: string): void {
    const intervalId = this.intervalIds.get(deviceId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervalIds.delete(deviceId);
      console.log(`Stopped simulation for device: ${deviceId}`);
    }
  }

  /**
   * Stop all simulations
   */
  stopAllSimulations(): void {
    for (const [deviceId, intervalId] of this.intervalIds.entries()) {
      clearInterval(intervalId);
      console.log(`Stopped simulation for device: ${deviceId}`);
    }
    this.intervalIds.clear();
  }

  /**
   * Generate telemetry data based on device type
   */
  private generateTelemetry(device: Device): void {
    const telemetryData: Record<string, string | number | boolean> = {};
    const now = new Date().toISOString();

    switch (device.type) {
      case DeviceType.TEMPERATURE_SENSOR:
        telemetryData.temperature = this.getRealisticTemperature();
        telemetryData.unit = 'celsius';
        break;

      case DeviceType.HUMIDITY_SENSOR:
        telemetryData.humidity = this.getRealisticHumidity();
        telemetryData.unit = 'percent';
        break;

      case DeviceType.SMART_PLUG:
      case DeviceType.POWER_MONITOR:
        const isOn = device.metadata?.state === 'on';
        telemetryData.powerConsumption = isOn ? this.getRandomValue(50, 200) : 0;
        telemetryData.voltage = this.getRandomValue(220, 240);
        telemetryData.current = isOn ? this.getRandomValue(0.2, 1.0, 2) : 0;
        telemetryData.unit = 'watts';
        telemetryData.state = isOn ? 'on' : 'off';
        break;

      case DeviceType.FAN:
        const fanOn = device.metadata?.state === 'on';
        const speed = device.metadata?.speed || 1;
        telemetryData.state = fanOn ? 'on' : 'off';
        telemetryData.speed = fanOn ? speed : 0;
        telemetryData.powerConsumption = fanOn ? speed * 30 : 0;
        telemetryData.rpm = fanOn ? speed * 800 : 0;
        break;

      case DeviceType.AC:
        const acOn = device.metadata?.state === 'on';
        const targetTemp = device.metadata?.temperature || 24;
        telemetryData.state = acOn ? 'on' : 'off';
        telemetryData.targetTemperature = targetTemp;
        telemetryData.currentTemperature = this.getRealisticTemperature();
        telemetryData.powerConsumption = acOn ? this.getRandomValue(800, 1500) : 0;
        telemetryData.mode = device.metadata?.mode || 'cool';
        break;

      case DeviceType.LIGHT:
        const lightOn = device.metadata?.state === 'on';
        const brightness = device.metadata?.brightness || 100;
        telemetryData.state = lightOn ? 'on' : 'off';
        telemetryData.brightness = lightOn ? brightness : 0;
        telemetryData.powerConsumption = lightOn ? (brightness / 100) * 15 : 0;
        break;

      case DeviceType.MOTION_SENSOR:
        telemetryData.motion = Math.random() > 0.7; // 30% chance of detecting motion
        telemetryData.lastMotion = now;
        break;

      default:
        telemetryData.status = 'active';
    }

    const telemetry: TelemetryData = {
      deviceId: device.id,
      timestamp: now,
      data: telemetryData,
    };

    telemetryStore.addTelemetry(telemetry);

    // Also update device last activity
    deviceStore.updateDevice(device.id, {
      lastActivity: now,
    });
  }

  /**
   * Generate realistic temperature with gradual variations
   */
  private getRealisticTemperature(): number {
    const hourOfDay = new Date().getHours();
    // Temperature varies based on time of day
    const timeVariation = Math.sin((hourOfDay - 6) * Math.PI / 12) * 5;
    const randomVariation = (Math.random() - 0.5) * 2;
    return Math.round((this.baseTemperature + timeVariation + randomVariation) * 10) / 10;
  }

  /**
   * Generate realistic humidity with variations
   */
  private getRealisticHumidity(): number {
    const randomVariation = (Math.random() - 0.5) * 10;
    return Math.round((this.baseHumidity + randomVariation) * 10) / 10;
  }

  /**
   * Generate random value within range
   */
  private getRandomValue(min: number, max: number, decimals: number = 1): number {
    const value = Math.random() * (max - min) + min;
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Set base environmental parameters
   */
  setEnvironment(temperature?: number, humidity?: number): void {
    if (temperature !== undefined) {
      this.baseTemperature = temperature;
    }
    if (humidity !== undefined) {
      this.baseHumidity = humidity;
    }
  }
}

export const deviceSimulator = new DeviceSimulator();
