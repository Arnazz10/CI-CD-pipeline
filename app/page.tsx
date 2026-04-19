'use client';

import React, { useEffect, useState } from 'react';
import PipelineCard from '@/components/PipelineCard';
import TriggerModal from '@/components/TriggerModal';
import { PipelineRun, EnvironmentStatus } from '@/lib/types';
import { Plus, History, Activity, Terminal, ShieldCheck, Cpu } from 'lucide-react';

export default function Dashboard() {
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/runs');
      const data = await response.json();
      setRuns(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTrigger = async (data: any) => {
    try {
      await fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
    } catch (error) {
      console.error('Trigger error:', error);
    }
  };

  const getLatestRun = (env: string) => {
    return runs.find(r => r.environment === env) || null;
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)] font-black uppercase tracking-[0.2em] text-[10px]">
            <Activity className="w-4 h-4" />
            Infrastructure Real-time
          </div>
          <h1 className="text-4xl font-black tracking-tighter">System Overview</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 group shadow-[0_4px_20px_rgba(0,229,192,0.2)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Trigger Pipeline
        </button>
      </div>

      {/* Environment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PipelineCard environment="Development" run={getLatestRun('development')} />
        <PipelineCard environment="Staging" run={getLatestRun('staging')} />
        <PipelineCard environment="Production" run={getLatestRun('production')} />
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cluster Health', value: '99.9%', icon: ShieldCheck, color: 'text-[var(--accent)]' },
          { label: 'Active Pods', value: '12/12', icon: Cpu, color: 'text-blue-400' },
          { label: 'Build Success', value: '94%', icon: Activity, color: 'text-green-400' },
          { label: 'Avg Build Time', value: '2m 14s', icon: Terminal, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="surface p-4 rounded-xl flex items-center gap-4 group hover:border-[var(--muted)] transition-colors">
            <div className={`p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{stat.label}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Build History */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-[var(--muted)]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">Build History</h2>
        </div>
        
        <div className="surface rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--background)] text-[10px] uppercase font-black tracking-widest text-[var(--muted)]">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Environment</th>
                <th className="px-6 py-4">Commit</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {runs.map((run) => (
                <tr 
                  key={run.id} 
                  className="hover:bg-[var(--background)] transition-colors cursor-pointer group"
                  onClick={() => window.location.href = `/pipelines/${run.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         run.status === 'success' ? 'bg-[var(--accent)]' : 
                         run.status === 'failed' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                       }`} />
                       <span className={`text-xs font-bold uppercase ${
                         run.status === 'success' ? 'text-[var(--accent)]' : 
                         run.status === 'failed' ? 'text-red-500' : 'text-amber-500'
                       }`}>
                         {run.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black uppercase tracking-tighter opacity-70">{run.environment}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                    {run.commitSha.substring(0, 7)}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">{run.branch}</td>
                  <td className="px-6 py-4 text-xs font-medium text-[var(--muted)]">
                    {run.completedAt 
                      ? `${Math.round((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000)}s` 
                      : '---'}
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--muted)]">
                    {new Date(run.startedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {runs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)] font-medium">
                    No run history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TriggerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTrigger={handleTrigger} 
      />
    </div>
  );
}
