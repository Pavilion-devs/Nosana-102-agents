import { Device, DeviceStatus } from '../../shared';

/**
 * In-memory device store
 * In production, this would be replaced with a database
 */
class DeviceStore {
  private devices: Map<string, Device> = new Map();

  async addDevice(device: Device): Promise<Device> {
    this.devices.set(device.id, device);
    return device;
  }

  async getDevice(deviceId: string): Promise<Device | undefined> {
    return this.devices.get(deviceId);
  }

  async getAllDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }

  async updateDevice(deviceId: string, updates: Partial<Device>): Promise<Device | undefined> {
    const device = this.devices.get(deviceId);
    if (!device) return undefined;

    const updatedDevice = {
      ...device,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.devices.set(deviceId, updatedDevice);
    return updatedDevice;
  }

  async removeDevice(deviceId: string): Promise<boolean> {
    return this.devices.delete(deviceId);
  }

  async updateDeviceStatus(deviceId: string, status: DeviceStatus): Promise<Device | undefined> {
    return this.updateDevice(deviceId, {
      status,
      lastActivity: new Date().toISOString(),
    });
  }

  async getDevicesByType(type: string): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(device => device.type === type);
  }

  async getOnlineDevices(): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(
      device => device.status === DeviceStatus.ONLINE
    );
  }
}

export const deviceStore = new DeviceStore();
