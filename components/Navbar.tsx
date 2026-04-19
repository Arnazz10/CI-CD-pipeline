'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Settings, Activity, Server } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[var(--background)]" />
            </div>
            <span className="text-xl font-bold tracking-tight">Pipeline<span className="text-[var(--accent)]">Hub</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)] rounded-md transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] rounded-md transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">k8s-us-east-1</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--border)]">
            <Server className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Registry Ready</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
