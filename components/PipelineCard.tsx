'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, GitBranch, Hash, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PipelineRun, Status } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PipelineCardProps {
  run: PipelineRun | null;
  environment: string;
}

const StatusBadge = ({ status }: { status: Status }) => {
  switch (status) {
    case 'success':
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 text-[10px] uppercase font-black">
          <CheckCircle2 className="w-3 h-3" />
          Success
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] uppercase font-black">
          <AlertCircle className="w-3 h-3" />
          Failed
        </div>
      );
    case 'running':
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] uppercase font-black transition-all">
          <Loader2 className="w-3 h-3 animate-spin" />
          Running
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--muted)]/10 text-[var(--muted)] border border-[var(--border)] text-[10px] uppercase font-black">
          Pending
        </div>
      );
  }
};

export default function PipelineCard({ run, environment }: PipelineCardProps) {
  if (!run) {
    return (
      <div className="surface rounded-xl p-6 opacity-50 border-dashed">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">{environment}</h2>
          <div className="text-[10px] font-bold text-[var(--muted)] bg-[var(--background)] px-2 py-1 rounded uppercase tracking-tighter">Inactive</div>
        </div>
        <div className="py-8 flex flex-col items-center justify-center text-[var(--muted)]">
          <p className="text-xs font-semibold">No recent deployments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface rounded-xl p-6 group hover:border-[var(--accent)] transition-all relative overflow-hidden">
      {run.status === 'running' && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent animate-shimmer" />
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-1">{environment}</h2>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">v1.0.{run.imageTag.split('.')[2].split('-')[0]}</span>
            <StatusBadge status={run.status} />
          </div>
        </div>
        <Link 
          href={`/pipelines/${run.id}`}
          className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors group/btn"
        >
          <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover/btn:text-[var(--accent)] transition-colors" />
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] leading-none">
              <GitBranch className="w-3 h-3" />
              Branch
            </div>
            <div className="text-xs font-semibold truncate leading-tight">{run.branch}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] leading-none">
              <Hash className="w-3 h-3" />
              Commit
            </div>
            <div className="text-xs font-mono text-[var(--accent)] leading-tight">{run.commitSha.substring(0, 7)}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            <span>Deployed {formatDistanceToNow(new Date(run.startedAt))} ago</span>
          </div>
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-[var(--background)] border-2 border-[var(--surface)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
