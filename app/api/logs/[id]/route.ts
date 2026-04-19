import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const encoder = new TextEncoder();
  const { id: runId } = await params;

  const stream = new ReadableStream({
    async start(controller) {
      let lastLogCount = 0;
      
      const interval = setInterval(() => {
        const run = store.getRun(runId);
        if (!run) {
          controller.close();
          clearInterval(interval);
          return;
        }

        const allLogs = run.stages.flatMap(s => s.logs);
        
        if (allLogs.length > lastLogCount) {
          const newLogs = allLogs.slice(lastLogCount);
          newLogs.forEach(log => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ log })}\n\n`));
          });
          lastLogCount = allLogs.length;
        }

        if (run.status === 'success' || run.status === 'failed') {
          // Send one last check and close
          controller.close();
          clearInterval(interval);
        }
      }, 500);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
