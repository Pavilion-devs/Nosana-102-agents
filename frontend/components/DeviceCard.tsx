'use client';

import { Device } from '@/lib/api';
import {
  Thermometer,
  Droplets,
  Fan,
  Snowflake,
  Lightbulb,
  Plug,
  Radio,
  Zap,
  Power,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { useQuery } from '@tanstack/react-query';
import { fetchTelemetry } from '@/lib/api';

interface DeviceCardProps {
  device: Device;
}

const deviceIcons: Record<string, any> = {
  temperature_sensor: Thermometer,
  humidity_sensor: Droplets,
  fan: Fan,
  ac: Snowflake,
  light: Lightbulb,
  smart_plug: Plug,
  motion_sensor: Radio,
  power_monitor: Zap,
};

const deviceColors: Record<string, string> = {
  temperature_sensor: 'text-orange-500 bg-orange-500/20 ring-orange-500/30',
  humidity_sensor: 'text-blue-500 bg-blue-500/20 ring-blue-500/30',
  fan: 'text-cyan-500 bg-cyan-500/20 ring-cyan-500/30',
  ac: 'text-purple-500 bg-purple-500/20 ring-purple-500/30',
  light: 'text-amber-500 bg-amber-500/20 ring-amber-500/30',
  smart_plug: 'text-emerald-500 bg-emerald-500/20 ring-emerald-500/30',
  motion_sensor: 'text-pink-500 bg-pink-500/20 ring-pink-500/30',
  power_monitor: 'text-yellow-500 bg-yellow-500/20 ring-yellow-500/30',
};

export function DeviceCard({ device }: DeviceCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: string;
    params?: any;
  } | null>(null);

  // Fetch latest telemetry
  const { data: telemetry } = useQuery({
    queryKey: ['telemetry', device.id],
    queryFn: () => fetchTelemetry(device.id, 1),
    refetchInterval: 5000,
  });

  const Icon = deviceIcons[device.type] || Zap;
  const colorClasses = deviceColors[device.type] || 'text-gray-500 bg-gray-500/20 ring-gray-500/30';

  const latestData = telemetry?.[0]?.data;

  const handleControlClick = (action: string, params?: any) => {
    setPendingAction({ action, params });
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    // TODO: Implement control action
    console.log('Confirmed action:', pendingAction);
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const renderDeviceSpecificContent = () => {
    const isOn = device.metadata?.state === 'on';

    switch (device.type) {
      case 'temperature_sensor':
        return (
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-white">
              {latestData?.temperature || '--'}°C
            </div>
            <div className="mt-1 text-xs text-white/60">
              {latestData?.unit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
            </div>
          </div>
        );

      case 'humidity_sensor':
        return (
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-white">
              {latestData?.humidity || '--'}%
            </div>
            <div className="mt-1 text-xs text-white/60">Relative Humidity</div>
          </div>
        );

      case 'fan':
        return (
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-2xl font-bold tracking-tight text-white">
                Speed: {device.metadata?.speed || 0}
              </div>
              <div className="text-xs text-white/60">
                {latestData?.rpm || 0} RPM
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleControlClick(isOn ? 'turn_off' : 'turn_on')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                  isOn
                    ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/30 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {isOn ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          </div>
        );

      case 'ac':
        return (
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {device.metadata?.temperature || 24}°C
              </div>
              <div className="text-xs text-white/60">
                Target • {device.metadata?.mode || 'cool'}
              </div>
            </div>
            <button
              onClick={() => handleControlClick(isOn ? 'turn_off' : 'turn_on')}
              className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                isOn
                  ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/30 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              {isOn ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
        );

      case 'light':
        return (
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {device.metadata?.brightness || 0}%
              </div>
              <div className="text-xs text-white/60">Brightness</div>
            </div>
            <button
              onClick={() => handleControlClick('toggle')}
              className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                isOn
                  ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-white/10 text-white/70 ring-1 ring-white/20 hover:bg-white/20'
              }`}
            >
              Toggle
            </button>
          </div>
        );

      case 'smart_plug':
      case 'power_monitor':
        return (
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-white">
              {latestData?.powerConsumption || 0}W
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
              <Zap className="h-3 w-3" />
              {latestData?.voltage || 230}V •{' '}
              {latestData?.current?.toFixed(2) || 0}A
            </div>
          </div>
        );

      case 'motion_sensor':
        return (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  latestData?.motion ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                }`}
              ></div>
              <span className="text-lg font-semibold text-white">
                {latestData?.motion ? 'Motion Detected' : 'No Motion'}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-3 text-sm text-white/60">No data available</div>
        );
    }
  };

  return (
    <>
      <div className="group rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition-all hover:bg-white/[0.07] hover:ring-white/20">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${colorClasses}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">
                {device.name}
              </div>
              <div className="text-xs text-white/60">{device.location}</div>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium ${
              device.status === 'online'
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-red-500/20 text-red-500'
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                device.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            ></div>
            {device.status}
          </div>
        </div>

        {/* Content */}
        {renderDeviceSpecificContent()}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-xs text-white/50">
            {formatDistanceToNow(new Date(device.lastActivity), {
              addSuffix: true,
            })}
          </span>
          <button className="rounded-lg px-2 py-1 text-xs font-medium text-white/70 hover:bg-white/10 transition-colors">
            Details
          </button>
        </div>
      </div>

      {showConfirmation && pendingAction && (
        <ConfirmationModal
          device={device}
          action={pendingAction.action}
          params={pendingAction.params}
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowConfirmation(false);
            setPendingAction(null);
          }}
        />
      )}
    </>
  );
}
