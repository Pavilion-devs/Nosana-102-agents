import { DeviceType, DeviceStatus } from '../shared';
import { deviceStore } from '../mastra/stores/device.store';
import { deviceSimulator } from './device-simulator';

/**
 * Seed initial demo devices
 */
export async function seedDevices() {
  console.log('Seeding demo devices...');

  const demoDevices = [
    {
      id: 'device_temp_001',
      name: 'Living Room Temp Sensor',
      type: DeviceType.TEMPERATURE_SENSOR,
      status: DeviceStatus.ONLINE,
      location: 'Living Room',
      metadata: {},
    },
    {
      id: 'device_humid_001',
      name: 'Living Room Humidity Sensor',
      type: DeviceType.HUMIDITY_SENSOR,
      status: DeviceStatus.ONLINE,
      location: 'Living Room',
      metadata: {},
    },
    {
      id: 'device_fan_001',
      name: 'Ceiling Fan',
      type: DeviceType.FAN,
      status: DeviceStatus.ONLINE,
      location: 'Living Room',
      metadata: {
        state: 'off',
        speed: 2,
      },
    },
    {
      id: 'device_ac_001',
      name: 'Air Conditioner',
      type: DeviceType.AC,
      status: DeviceStatus.ONLINE,
      location: 'Bedroom',
      metadata: {
        state: 'off',
        temperature: 24,
        mode: 'cool',
      },
    },
    {
      id: 'device_light_001',
      name: 'Living Room Light',
      type: DeviceType.LIGHT,
      status: DeviceStatus.ONLINE,
      location: 'Living Room',
      metadata: {
        state: 'on',
        brightness: 80,
      },
    },
    {
      id: 'device_plug_001',
      name: 'Smart Plug 1',
      type: DeviceType.SMART_PLUG,
      status: DeviceStatus.ONLINE,
      location: 'Office',
      metadata: {
        state: 'on',
      },
    },
    {
      id: 'device_motion_001',
      name: 'Motion Detector',
      type: DeviceType.MOTION_SENSOR,
      status: DeviceStatus.ONLINE,
      location: 'Hallway',
      metadata: {},
    },
    {
      id: 'device_power_001',
      name: 'Power Monitor',
      type: DeviceType.POWER_MONITOR,
      status: DeviceStatus.ONLINE,
      location: 'Main Panel',
      metadata: {
        state: 'on',
      },
    },
  ];

  for (const deviceData of demoDevices) {
    const device = await deviceStore.addDevice({
      ...deviceData,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Start simulation for each device
    deviceSimulator.startSimulation(device, 5000); // Update every 5 seconds
  }

  console.log(`Seeded ${demoDevices.length} demo devices and started simulations`);
}
