'use client';

import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { StatsCard } from '@/components/StatsCard';
import { DeviceGrid } from '@/components/DeviceGrid';
import { useQuery } from '@tanstack/react-query';
import { fetchDevices } from '@/lib/api';
import { Zap, Activity, AlertTriangle } from 'lucide-react';

export default function Home() {
  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 10000,
  });

  const onlineDevices = devices?.filter((d) => d.status === 'online').length || 0;
  const totalDevices = devices?.length || 0;
  const offlineDevices = totalDevices - onlineDevices;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Device Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Monitor and control your IoT devices
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Total Devices"
                value={totalDevices}
                subtitle={`${onlineDevices} online, ${offlineDevices} offline`}
                icon={<Zap className="w-4 h-4" />}
              />

              <StatsCard
                title="Online Devices"
                value={onlineDevices}
                subtitle="Active and responding"
                icon={<Activity className="w-4 h-4" />}
                trend={{ value: '100%', isPositive: true }}
              />

              <StatsCard
                title="Offline Devices"
                value={offlineDevices}
                subtitle="Requires attention"
                icon={<AlertTriangle className="w-4 h-4" />}
                trend={offlineDevices > 0 ? { value: `${offlineDevices}`, isPositive: false } : undefined}
              />
            </div>

            {/* Devices Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Devices</h2>
                <p className="text-sm text-gray-500">Monitor and control your IoT devices</p>
              </div>

              <DeviceGrid />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
