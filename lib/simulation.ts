import { store } from './store';
import { PipelineRun, Status, PipelineStage } from './types';

const STAGES_CONFIG = [
  { name: 'Source Checkout', duration: 1000 },
  { name: 'Install & Build', duration: 3000 },
  { name: 'Unit Tests', duration: 2000 },
  { name: 'Docker Build', duration: 4000 },
  { name: 'Push to Registry', duration: 2000 },
  { name: 'K8s Apply', duration: 3000 },
  { name: 'Health Check', duration: 2000 },
];

export function createInitialRun(props: { branch: string; environment: 'development' | 'staging' | 'production' }): PipelineRun {
  const id = `run-${Math.random().toString(36).substring(2, 9)}`;
  const commitSha = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
  
  const stages: PipelineStage[] = STAGES_CONFIG.map((config, index) => ({
    id: `stage-${index}`,
    name: config.name,
    status: index === 0 ? 'running' : 'pending',
    duration: config.duration / 1000,
    startedAt: index === 0 ? new Date().toISOString() : undefined,
    logs: [],
  }));

  const run: PipelineRun = {
    id,
    branch: props.branch,
    commitSha,
    commitMessage: `feat: add new functionality to ${props.branch} branch`,
    triggerType: 'manual',
    environment: props.environment,
    status: 'running',
    startedAt: new Date().toISOString(),
    stages,
    imageTag: `arnazz10/app:v1.0.${Math.floor(Math.random() * 100)}-${commitSha.substring(0, 7)}`,
  };

  store.addRun(run);
  startSimulation(run.id);
  
  return run;
}

async function startSimulation(runId: string) {
  const run = store.getRun(runId);
  if (!run) return;

  for (let i = 0; i < run.stages.length; i++) {
    const stage = run.stages[i];
    
    // Set current stage to running
    stage.status = 'running';
    stage.startedAt = new Date().toISOString();
    store.updateRun({ ...run });

    // Simulate logs for this stage
    await simulateStageLogs(runId, i);

    // Complete stage
    stage.status = 'success';
    stage.completedAt = new Date().toISOString();
    store.updateRun({ ...run });

    // Update pod health if it's the last stage
    if (stage.name === 'Health Check') {
      updatePodHealth(run.environment);
    }
  }

  run.status = 'success';
  run.completedAt = new Date().toISOString();
  store.updateRun({ ...run });
}

async function simulateStageLogs(runId: string, stageIndex: number) {
  const run = store.getRun(runId);
  if (!run) return;
  const stage = run.stages[stageIndex];
  const config = STAGES_CONFIG[stageIndex];

  const logTemplates: Record<string, string[]> = {
    'Source Checkout': [
      `Cloning repository from github.com/arnazz10/pipeline-hub.git`,
      `Checking out branch ${run.branch}`,
      `Commit SHA: ${run.commitSha}`,
      `Successfully checked out ${run.commitSha.substring(0, 7)}`,
    ],
    'Install & Build': [
      `npm install --frozen-lockfile`,
      `added 452 packages in 2s`,
      `npm run build`,
      `Creating an optimized production build...`,
      `✓ Compiled successfully`,
      `Route (app)      Size     First Load JS`,
      `┌ λ /dashboard   1.2 kB         132 kB`,
      `└ λ /settings    452 B          84 kB`,
    ],
    'Unit Tests': [
      `jest --passWithNoTests`,
      `PASS src/components/StageStep.test.tsx`,
      `PASS src/lib/simulation.test.ts`,
      `Test Suites: 2 passed, 2 total`,
      `Tests:       12 passed, 12 total`,
      `Snapshots:   0 total`,
      `Time:        1.45s`,
    ],
    'Docker Build': [
      `docker build -t ${run.imageTag} .`,
      `Step 1/8 : FROM node:20-alpine`,
      `Step 2/8 : WORKDIR /app`,
      `Step 3/8 : COPY package*.json ./`,
      `Step 4/8 : RUN npm install --production`,
      `Step 5/8 : COPY . .`,
      `Step 6/8 : RUN npm run build`,
      `Step 7/8 : EXPOSE 3000`,
      `Step 8/8 : CMD ["npm", "start"]`,
      `Successfully built ${run.imageTag}`,
    ],
    'Push to Registry': [
      `docker push ${run.imageTag}`,
      `The push refers to repository [docker.io/${run.imageTag.split(':')[0]}]`,
      `Preparing...`,
      `Pushing [==================================================>]`,
      `v1.0.3: digest: sha256:7f83... size: 1572`,
    ],
    'K8s Apply': [
      `kubectl config use-context k8s-us-east-1`,
      `Switched to context "k8s-us-east-1".`,
      `kubectl apply -f k8s/deployment.yaml`,
      `deployment.apps/pipeline-hub-app configured`,
      `service/pipeline-hub-service unchanged`,
      `Waiting for rollout to finish: 0 of 3 updated replicas are available...`,
      `deployment "pipeline-hub-app" successfully rolled out`,
    ],
    'Health Check': [
      `curl -I http://app-${run.environment}.internal/health`,
      `HTTP/1.1 200 OK`,
      `Content-Type: application/json`,
      `Environment: ${run.environment}`,
      `Version: ${run.imageTag.split(':')[1]}`,
      `Health: Healthy`,
    ],
  };

  const logs = logTemplates[stage.name] || [`Starting stage ${stage.name}...`];
  const delay = config.duration / logs.length;

  for (const logLine of logs) {
    const timestamp = new Date().toISOString();
    const formattedLog = `[${timestamp}] INFO: ${logLine}`;
    stage.logs.push(formattedLog);
    store.updateRun({ ...run });
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

function updatePodHealth(envName: string) {
  const env = store.getEnvironment(envName);
  if (!env) return;

  const updatedPods = env.pods.map(pod => ({
    ...pod,
    status: 'Running' as const,
    cpuUsage: Math.floor(Math.random() * 20) + 5,
    memoryUsage: Math.floor(Math.random() * 20) + 15,
  }));

  store.updatePods(envName, updatedPods);
}
