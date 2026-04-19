'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Copy, Trash2, Search } from 'lucide-react';

interface LogViewerProps {
  runId: string;
  autoScroll?: boolean;
}

const LogViewer = ({ runId, autoScroll = true }: LogViewerProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLogs([]); // Reset logs when runId changes
    const eventSource = new EventSource(`/api/logs/${runId}`);

    eventSource.onmessage = (event) => {
      const { log } = JSON.parse(event.data);
      setLogs((prev) => [...prev, log]);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [runId]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const highlightLog = (line: string) => {
    if (line.includes('ERROR')) return 'text-red-400 font-bold';
    if (line.includes('WARN')) return 'text-amber-400 font-bold';
    if (line.includes('SUCCESS')) return 'text-[var(--accent)] font-bold';
    if (line.includes('INFO')) return 'text-blue-400';
    return 'text-[var(--muted)]';
  };

  const filteredLogs = logs.filter(log => 
    log.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="surface rounded-xl flex flex-col h-[500px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            Build Logs
            {logs.length > 0 && (
              <span className="bg-[var(--surface)] text-[var(--accent)] text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)]">
                STREAMING
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[var(--background)] border border-[var(--border)] text-[10px] pl-8 pr-3 py-1.5 rounded-md focus:outline-none focus:border-[var(--accent)] transition-colors w-40"
            />
          </div>
          <button 
            onClick={() => setLogs([])}
            className="p-1.5 hover:bg-[var(--surface)] rounded-md text-[var(--muted)] hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(logs.join('\n'))}
            className="p-1.5 hover:bg-[var(--surface)] rounded-md text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed bg-[#05070a]"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--muted)]">
            <LoaderIcon className="w-6 h-6 mb-4 animate-spin opacity-20" />
            <span className="text-sm font-medium opacity-40">Waiting for log stream...</span>
          </div>
        ) : (
          filteredLogs.map((line, i) => (
            <div key={i} className="flex gap-4 group">
              <span className="select-none text-[var(--muted)] opacity-20 text-[11px] w-8 text-right shrink-0">
                {i + 1}
              </span>
              <span className={highlightLog(line)}>
                {line}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const LoaderIcon = ({ className }: { className?: string }) => (
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

export default LogViewer;
