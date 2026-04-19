export type Status = 'pending' | 'running' | 'success' | 'failed';

export interface PipelineStage {
  id: string;
  name: string;
  status: Status;
  duration?: number; // duration in seconds
  startedAt?: string;
  completedAt?: string;
  logs: string[];
}

export interface PipelineRun {
  id: string;
  branch: string;
  commitSha: string;
  commitMessage: string;
  triggerType: 'push' | 'manual';
  environment: 'development' | 'staging' | 'production';
  status: Status;
  startedAt: string;
  completedAt?: string;
  stages: PipelineStage[];
  imageTag: string;
}

export interface PodStatus {
  id: string;
  name: string;
  status: 'Running' | 'Pending' | 'Terminating' | 'Failed';
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage (relative to limit)
  restarts: number;
}

export interface EnvironmentStatus {
  name: 'development' | 'staging' | 'production';
  lastRunId: string | null;
  cluster: string;
  namespace: string;
  registry: string;
  pods: PodStatus[];
}
