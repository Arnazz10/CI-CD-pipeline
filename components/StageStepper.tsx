'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, GitPullRequest, Box, UploadCloud, Cloud, ShieldCheck } from 'lucide-react';
import { Status } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StageStepProps {
  name: string;
  status: Status;
  isLast?: boolean;
}

const getIcon = (name: string, status: Status) => {
  if (status === 'running') return <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" />;
  if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />;
  if (status === 'failed') return <CheckCircle2 className="w-5 h-5 text-red-500 rotate-45" />;

  switch (name) {
    case 'Source Checkout': return <GitPullRequest className="w-5 h-5" />;
    case 'Install & Build': return <Box className="w-5 h-5" />;
    case 'Unit Tests': return <ShieldCheck className="w-5 h-5" />;
    case 'Docker Build': return <Box className="w-5 h-5" />;
    case 'Push to Registry': return <UploadCloud className="w-5 h-5" />;
    case 'K8s Apply': return <Cloud className="w-5 h-5" />;
    case 'Health Check': return <ActivityIcon className="w-5 h-5" />;
    default: return <Circle className="w-5 h-5" />;
  }
};

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const StageStep = ({ name, status, isLast }: StageStepProps) => {
  return (
    <div className={cn("flex items-center gap-4 relative", !isLast && "flex-1")}>
      <div className="flex flex-col items-center gap-2 z-10">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
          status === 'running' && "border-[var(--accent)] bg-[var(--accent)]/10",
          status === 'success' && "border-[var(--accent)] bg-[var(--accent)]",
          status === 'failed' && "border-red-500 bg-red-500/10",
          status === 'pending' && "border-[var(--border)] bg-[var(--background)]"
        )}>
          <div className={cn(
            "transition-colors",
            status === 'success' ? "text-[var(--background)]" : "text-[var(--muted)]"
          )}>
            {getIcon(name, status)}
          </div>
        </div>
        <span className={cn(
          "text-[10px] uppercase font-bold tracking-widest whitespace-nowrap",
          status === 'running' ? "text-[var(--accent)]" : "text-[var(--muted)]"
        )}>
          {name}
        </span>
      </div>

      {!isLast && (
        <div className="flex-1 h-0.5 bg-[var(--border)] mt-[-18px] relative overflow-hidden">
          {status === 'success' && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="absolute inset-0 bg-[var(--accent)]"
            />
          )}
          {status === 'running' && (
            <motion.div 
              initial={{ left: '-100%' }}
              animate={{ left: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default function StageStepper({ stages }: { stages: any[] }) {
  return (
    <div className="flex items-center px-4 py-8 overflow-x-auto min-w-full">
      {stages.map((stage, index) => (
        <StageStep 
          key={stage.id} 
          name={stage.name} 
          status={stage.status} 
          isLast={index === stages.length - 1} 
        />
      ))}
    </div>
  );
}
