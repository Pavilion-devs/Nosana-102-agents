'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDevices } from '@/lib/api';
import { DeviceCard } from './DeviceCard';
import { Loader2 } from 'lucide-react';

export function DeviceGrid() {
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 p-4 ring-1 ring-red-500/20">
        <p className="text-sm font-medium text-red-500">
          Failed to load devices. Please check if the backend server is running.
        </p>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 p-8 text-center ring-1 ring-white/10">
        <p className="text-sm text-white/60">No devices found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
