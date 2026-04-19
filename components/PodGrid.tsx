'use client';

import React from 'react';
import { Box, RefreshCcw } from 'lucide-react';
import { PodStatus } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PodItem = ({ pod }: { pod: PodStatus }) => {
  return (
    <div className="surface p-4 rounded-xl flex flex-col gap-3 group hover:border-[var(--accent)] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className={cn(
            "w-4 h-4",
            pod.status === 'Running' ? "text-[var(--accent)]" : "text-[var(--muted)]"
          )} />
          <span className="text-sm font-semibold truncate max-w-[120px]">{pod.name}</span>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
          pod.status === 'Running' ? "bg-[var(--success)]/20 text-[var(--success)]" : "bg-[var(--muted)]/20 text-[var(--muted)]"
        )}>
          {pod.status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-[var(--muted)]">
            <span>CPU</span>
            <span className="text-[var(--foreground)]">{pod.cpuUsage}%</span>
          </div>
          <div className="h-1 bg-[var(--background)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--accent)] transition-all duration-1000" 
              style={{ width: `${pod.cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-[var(--muted)]">
            <span>Memory</span>
            <span className="text-[var(--foreground)]">{pod.memoryUsage}%</span>
          </div>
          <div className="h-1 bg-[var(--background)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000" 
              style={{ width: `${pod.memoryUsage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-[var(--muted)]">
        <RefreshCcw className="w-3 h-3" />
        <span>{pod.restarts} restarts</span>
      </div>
    </div>
  );
};

export default function PodGrid({ pods }: { pods: PodStatus[] }) {
  if (!pods || pods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--muted)] surface rounded-xl border-dashed">
        <Box className="w-8 h-8 mb-2 opacity-20" />
        <span className="text-sm font-medium">No active pods in this environment</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pods.map((pod) => (
        <PodItem key={pod.id} pod={pod} />
      ))}
    </div>
  );
}
