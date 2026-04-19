'use client';

import React from 'react';
import { 
  Webhook, 
  Layout, 
  Lock, 
  Bell, 
  ExternalLink, 
  Save, 
  Trash2,
  Github,
  Globe,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tighter">Configuration</h1>
        <p className="text-[var(--muted)] text-sm font-medium">Manage your pipeline webhooks, cluster secrets, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { label: 'Integrations', icon: Github, active: true },
            { label: 'Cluster Context', icon: Layout, active: false },
            { label: 'Environment Secrets', icon: Lock, active: false },
            { label: 'Notifications', icon: Bell, active: false },
            { label: 'Storage & History', icon: Database, active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20' 
                  : 'text-[var(--muted)] hover:bg-[var(--surface)] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 font-bold text-sm tracking-tight">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* GitHub Integration */}
          <div className="surface rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-widest">Source Control</h3>
              </div>
              <div className="flex items-center gap-1 text-[10px] uppercase font-black text-[var(--accent)]">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                Connected
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Github className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">arnazz10/pipeline-hub</div>
                    <div className="text-[10px] font-medium text-[var(--muted)]">Last synced: 2 minutes ago</div>
                  </div>
                </div>
                <button className="text-[var(--muted)] hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] ml-1">Webhook URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value="https://pipelinehub.internal/api/webhook/github"
                      className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 px-4 text-xs font-mono text-[var(--muted)] outline-none"
                    />
                    <button className="surface px-4 rounded-xl hover:bg-[var(--background)] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Docker Registry */}
          <div className="surface rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest">Registry Settings</h3>
            </div>
            <div className="p-6 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] ml-1">Registry Host</label>
                    <input 
                      type="text" 
                      defaultValue="registry.hub.docker.com"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-[var(--accent)] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] ml-1">Organization</label>
                    <input 
                      type="text" 
                      defaultValue="arnazz10"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-[var(--accent)] transition-all"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,229,192,0.2)]">
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
