'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StageStepper from '@/components/StageStepper';
import LogViewer from '@/components/LogViewer';
import PodGrid from '@/components/PodGrid';
import { PipelineRun, PodStatus } from '@/lib/types';
import { 
  ChevronLeft, 
  GitBranch, 
  Hash, 
  Clock, 
  Box, 
  RotateCcw, 
  Share2, 
  Terminal,
  Activity,
  Server
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PipelineDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [run, setRun] = useState<PipelineRun | null>(null);
  const [pods, setPods] = useState<PodStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'pods'>('logs');

  const fetchRun = async () => {
    try {
      const response = await fetch(`/api/runs/${id}`);
      if (!response.ok) throw new Error('Run not found');
      const data = await response.json();
      setRun(data);
      
      // Fetch pods independently
      if (data.environment) {
        const podsRes = await fetch(`/api/pods?environment=${data.environment}`);
        const podsData = await podsRes.json();
        setPods(podsData);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      router.push('/');
    }
  };

  useEffect(() => {
    fetchRun();
    const interval = setInterval(fetchRun, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (!run) return null;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors border border-[var(--border)]"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--muted)]" />
          </button>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-1 flex items-center gap-2">
              <span className="text-[var(--accent)] font-black">RUN</span>
              {id}
            </div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              Deployment to {run.environment}
              <div className={`w-2 h-2 rounded-full ${
                run.status === 'success' ? 'bg-[var(--accent)]' : 
                run.status === 'failed' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
              }`} />
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-bold hover:bg-[var(--surface)] transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Rollback
          </button>
        </div>
      </div>

      {/* Hero Info Card */}
      <div className="surface rounded-2xl p-6 bg-gradient-to-br from-[var(--surface)] to-[var(--background)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
              <GitBranch className="w-3.5 h-3.5" />
              Branch
            </div>
            <div className="text-sm font-bold">{run.branch}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
              <Hash className="w-3.5 h-3.5" />
              Release Tag
            </div>
            <div className="text-sm font-mono text-[var(--accent)] truncate">{run.imageTag.split(':')[1]}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
              <Clock className="w-3.5 h-3.5" />
              Started
            </div>
            <div className="text-sm font-bold">{formatDistanceToNow(new Date(run.startedAt))} ago</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
              <Server className="w-3.5 h-3.5" />
              Target Cluster
            </div>
            <div className="text-sm font-bold">k8s-us-east-1</div>
          </div>
        </div>
      </div>

      {/* Pipeline Stepper */}
      <div className="surface rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest">Workflow Pipeline</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--muted)]">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Success</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Active</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--border)]" /> Pending</div>
          </div>
        </div>
        <StageStepper stages={run.stages} />
      </div>

      {/* Tabs Section */}
      <div className="space-y-4">
        <div className="flex border-b border-[var(--border)]">
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'logs' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--muted)]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Build Logs
          </button>
          <button 
            onClick={() => setActiveTab('pods')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'pods' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--muted)]'
            }`}
          >
            <Activity className="w-4 h-4" />
            Infrastructure Status
          </button>
        </div>

        {activeTab === 'logs' ? (
          <LogViewer runId={id as string} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Target Environment: {run.environment}</h4>
              <div className="text-[10px] font-bold text-[var(--accent)] px-2 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                LIVE STATUS
              </div>
            </div>
            <PodGrid pods={pods} />
          </div>
        )}
      </div>
    </div>
  );
}
