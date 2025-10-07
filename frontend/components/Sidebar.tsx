'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Zap,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, current: true },
  { name: 'All Devices', icon: Zap, current: false },
  { name: 'Analytics', icon: BarChart3, current: false },
  { name: 'Settings', icon: Settings, current: false },
  { name: 'Help & Support', icon: HelpCircle, current: false },
];

export function Sidebar() {
  const [currentSection, setCurrentSection] = useState('Dashboard');

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">NEXUS</span>
        </div>
      </div>

      {/* Add Device Button */}
      <div className="p-4">
        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <span className="text-lg">+</span>
          Add Device
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === currentSection;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentSection(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left text-sm">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
