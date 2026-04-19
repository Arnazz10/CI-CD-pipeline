import { PipelineRun, EnvironmentStatus, PodStatus } from './types';

// Mock database in-memory
class PipelineStore {
  private static instance: PipelineStore;
  private runs: Map<string, PipelineRun> = new Map();
  private environments: Map<string, EnvironmentStatus> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): PipelineStore {
    if (!PipelineStore.instance) {
      PipelineStore.instance = new PipelineStore();
    }
    return PipelineStore.instance;
  }

  private initializeMockData() {
    // Initial environments
    const envs: EnvironmentStatus['name'][] = ['development', 'staging', 'production'];
    envs.forEach((name) => {
      this.environments.set(name, {
        name,
        lastRunId: null,
        cluster: 'k8s-us-east-1',
        namespace: name,
        registry: 'registry.hub.docker.com',
        pods: this.generateMockPods(name, 3),
      });
    });
  }

  private generateMockPods(env: string, count: number): PodStatus[] {
    return Array.from({ length: count }).map((_, i) => ({
      id: `pod-${env}-${i}`,
      name: `app-${env}-${Math.random().toString(36).substring(7)}`,
      status: 'Running',
      cpuUsage: Math.floor(Math.random() * 40) + 10,
      memoryUsage: Math.floor(Math.random() * 30) + 20,
      restarts: 0,
    }));
  }

  public addRun(run: PipelineRun) {
    this.runs.set(run.id, run);
    const env = this.environments.get(run.environment);
    if (env) {
      env.lastRunId = run.id;
    }
  }

  public updateRun(run: PipelineRun) {
    this.runs.set(run.id, run);
  }

  public getRun(id: string): PipelineRun | undefined {
    return this.runs.get(id);
  }

  public getAllRuns(): PipelineRun[] {
    return Array.from(this.runs.values()).sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  public getEnvironment(name: string): EnvironmentStatus | undefined {
    return this.environments.get(name);
  }

  public updatePods(envName: string, pods: PodStatus[]) {
    const env = this.environments.get(envName);
    if (env) {
      env.pods = pods;
    }
  }
}

// In Next.js development, the hot reloader might re-instantiate the store.
// We use a global variable to persist it across reloads.
const globalForStore = global as unknown as { store: PipelineStore };
export const store = globalForStore.store || PipelineStore.getInstance();
if (process.env.NODE_ENV !== 'production') globalForStore.store = store;
