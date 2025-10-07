'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchTelemetry, TelemetryData } from '@/lib/api';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface TelemetryChartProps {
  deviceId: string;
  deviceType: string;
  limit?: number;
}

export function TelemetryChart({
  deviceId,
  deviceType,
  limit = 20,
}: TelemetryChartProps) {
  const { data: telemetry, isLoading } = useQuery({
    queryKey: ['telemetry-chart', deviceId, limit],
    queryFn: () => fetchTelemetry(deviceId, limit),
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!telemetry || telemetry.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
        <p className="text-sm text-white/60">No telemetry data available</p>
      </div>
    );
  }

  // Reverse to show oldest to newest
  const chartData = [...telemetry].reverse().map((t) => ({
    timestamp: new Date(t.timestamp).getTime(),
    time: format(new Date(t.timestamp), 'HH:mm:ss'),
    ...t.data,
  }));

  const renderChart = () => {
    switch (deviceType) {
      case 'temperature_sensor':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
              />
              <YAxis
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#ffffff80' }}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#colorTemp)"
                name="Temperature (°C)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'humidity_sensor':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
              />
              <YAxis
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#ffffff80' }}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorHumidity)"
                name="Humidity (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'fan':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
              />
              <YAxis
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#ffffff80' }}
              />
              <Legend
                wrapperStyle={{ color: '#ffffff80', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="rpm"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                name="RPM"
              />
              <Line
                type="monotone"
                dataKey="speed"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Speed Level"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'power_monitor':
      case 'smart_plug':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
              />
              <YAxis
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#ffffff80' }}
              />
              <Legend
                wrapperStyle={{ color: '#ffffff80', fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="powerConsumption"
                stroke="#eab308"
                strokeWidth={2}
                fill="url(#colorPower)"
                name="Power (W)"
              />
              <Line
                type="monotone"
                dataKey="voltage"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Voltage (V)"
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Current (A)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'motion_sensor':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMotion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
              />
              <YAxis
                stroke="#ffffff60"
                tick={{ fill: '#ffffff60', fontSize: 12 }}
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(value) => (value === 1 ? 'Motion' : 'None')}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#ffffff80' }}
                formatter={(value: any) => [value ? 'Detected' : 'None', 'Motion']}
              />
              <Area
                type="stepAfter"
                dataKey="motion"
                stroke="#ec4899"
                strokeWidth={2}
                fill="url(#colorMotion)"
                name="Motion"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-white/60">
              Chart not available for this device type
            </p>
          </div>
        );
    }
  };

  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">
          Telemetry History
        </h3>
        <p className="text-xs text-white/60">
          Last {telemetry.length} readings
        </p>
      </div>
      {renderChart()}
    </div>
  );
}
