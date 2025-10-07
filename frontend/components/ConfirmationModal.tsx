'use client';

import { Device } from '@/lib/api';
import { AlertTriangle, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  device: Device;
  action: string;
  params?: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  device,
  action,
  params,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const getActionDescription = () => {
    switch (action) {
      case 'turn_on':
        return {
          title: 'Turn ON Device',
          description: `You are about to turn on ${device.name}`,
          currentState: 'Off',
          newState: 'On',
          impact: 'Device will start consuming power',
        };
      case 'turn_off':
        return {
          title: 'Turn OFF Device',
          description: `You are about to turn off ${device.name}`,
          currentState: 'On',
          newState: 'Off',
          impact: 'Device will stop all operations',
        };
      case 'toggle':
        return {
          title: 'Toggle Device',
          description: `You are about to toggle ${device.name}`,
          currentState: device.metadata?.state === 'on' ? 'On' : 'Off',
          newState: device.metadata?.state === 'on' ? 'Off' : 'On',
          impact: 'Device state will be reversed',
        };
      case 'set_temperature':
        return {
          title: 'Adjust Temperature',
          description: `You are about to change the temperature for ${device.name}`,
          currentState: `${device.metadata?.temperature || '?'}°C`,
          newState: `${params?.temperature || '?'}°C`,
          impact: 'This may affect power consumption',
        };
      default:
        return {
          title: 'Confirm Action',
          description: `You are about to perform an action on ${device.name}`,
          currentState: 'Unknown',
          newState: 'Unknown',
          impact: 'This action will be executed immediately',
        };
    }
  };

  const actionDetails = getActionDescription();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-lg rounded-2xl bg-zinc-900 p-6 ring-1 ring-white/10 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 text-white/60" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/30">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {actionDetails.title}
              </h3>
              <p className="text-sm text-white/60">Confirm Device Action</p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-medium text-white/90">
                {actionDetails.description}
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Device:</span>
                  <span className="font-semibold text-white">{device.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Type:</span>
                  <span className="font-semibold text-white capitalize">
                    {device.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Location:</span>
                  <span className="font-semibold text-white">
                    {device.location || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">ID:</span>
                  <span className="font-mono text-xs text-white/80">
                    {device.id}
                  </span>
                </div>
              </div>
            </div>

            {/* State Changes */}
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-medium text-white/90 mb-3">
                Changes:
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-white/50 mb-1">Current State</div>
                  <div className="text-sm font-semibold text-white">
                    {actionDetails.currentState}
                  </div>
                </div>
                <div className="mx-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white/40"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-white/50 mb-1">New State</div>
                  <div className="text-sm font-semibold text-emerald-500">
                    {actionDetails.newState}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-500">
                    Warning
                  </div>
                  <div className="mt-1 text-sm text-amber-500/80">
                    {actionDetails.impact}. This action will be executed
                    immediately and may affect connected devices.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-500 ring-1 ring-emerald-500/30 hover:bg-emerald-500/30 transition-all"
            >
              ✓ Confirm Action
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
