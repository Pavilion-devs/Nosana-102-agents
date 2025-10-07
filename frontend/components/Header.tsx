'use client';

import { Activity, Bell, Settings, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/30">
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-white">
              NEXUS
            </div>
            <div className="text-xs text-white/60">AI IoT Dashboard</div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden flex-1 max-w-xl px-8 md:block">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 transition-all focus-within:ring-emerald-500/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white/50"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
              placeholder="Search devices, ask NEXUS..."
            />
            <span className="hidden text-[11px] font-medium text-white/60 sm:inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-emerald-500">
              Connected
            </span>
          </div>

          {/* Notifications */}
          <button className="relative rounded-xl p-2 hover:bg-white/10 transition-colors">
            <Bell className="h-5 w-5 text-white/80" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-zinc-900"></span>
          </button>

          {/* Settings */}
          <button className="rounded-xl p-2 hover:bg-white/10 transition-colors">
            <Settings className="h-5 w-5 text-white/80" />
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-3 rounded-xl bg-white/5 p-1.5 pl-3 ring-1 ring-white/10 hover:bg-white/10 transition-all">
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-white">User</div>
              <div className="text-xs text-white/60">@user</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center ring-2 ring-white/20">
              <User className="h-4 w-4 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
