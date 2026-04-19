'use client';

import React, { useState } from 'react';
import { X, Play, GitBranch, Layout, Server, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrigger: (data: { branch: string; environment: 'development' | 'staging' | 'production' }) => void;
}

export default function TriggerModal({ isOpen, onClose, onTrigger }: TriggerModalProps) {
  const [branch, setBranch] = useState('main');
  const [environment, setEnvironment] = useState<'development' | 'staging' | 'production'>('development');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onTrigger({ branch, environment });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101]"
          >
            <div className="surface rounded-2xl shadow-2xl overflow-hidden border-[var(--border)]">
              <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest">Trigger Pipeline</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors text-[var(--muted)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] ml-1">Branch Context</label>
                    <div className="relative">
                      <GitBranch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                      <select 
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-[var(--accent)] appearance-none cursor-pointer"
                      >
                        <option value="main">main</option>
                        <option value="develop">develop</option>
                        <option value="feat/api-v2">feat/api-v2</option>
                        <option value="fix/auth-leak">fix/auth-leak</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] ml-1">Target Environment</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['development', 'staging', 'production'] as const).map((env) => (
                        <button
                          key={env}
                          type="button"
                          onClick={() => setEnvironment(env)}
                          className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            environment === env 
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)] shadow-[0_0_20px_rgba(0,229,192,0.1)]' 
                              : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]'
                          }`}
                        >
                          {env === 'development' ? 'Dev' : env === 'staging' ? 'Stg' : 'Prd'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] leading-relaxed text-amber-500/80 font-medium">
                    Manual trigger will override existing horizontal pod autoscaling and proceed with a rolling update on the selected cluster.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-sm font-bold hover:bg-[var(--background)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-3 px-8 py-3 rounded-xl bg-[var(--accent)] text-[var(--background)] text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,229,192,0.2)] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        Run Pipeline
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
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
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
