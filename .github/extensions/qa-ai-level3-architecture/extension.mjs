import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CanvasError, createCanvas, joinSession } from '@github/copilot-sdk/extension';
import declaration from './extension.json' with { type: 'json' };

const directory = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.join(directory, 'index.html');
const instances = new Map();

const actionHandlers = {
  show_architecture: async ({ instanceId }) => {
    const state = instances.get(instanceId);
    if (!state) throw new CanvasError('NOT_OPEN', 'Open the canvas before changing views.');
    state.view = 'architecture';
    return { view: state.view };
  },
  show_flow: async ({ instanceId }) => {
    const state = instances.get(instanceId);
    if (!state) throw new CanvasError('NOT_OPEN', 'Open the canvas before changing views.');
    state.view = 'flow';
    return { view: state.view };
  },
};

async function startServer(instanceId) {
  const state = instances.get(instanceId) ?? { view: 'architecture' };
  instances.set(instanceId, state);

  if (state.server) return state.url;

  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      if (url.pathname === '/state') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ view: state.view }));
        return;
      }
      if (url.pathname === '/view' && request.method === 'POST') {
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
        if (body.view !== 'architecture' && body.view !== 'flow') {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ error: 'Invalid view' }));
          return;
        }
        state.view = body.view;
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ view: state.view }));
        return;
      }
      if (url.pathname !== '/') {
        response.writeHead(404);
        response.end('Not found');
        return;
      }
      const html = await fs.readFile(pagePath, 'utf8');
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(html);
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Unable to render the diagram' }));
      session.log(error);
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  if (!address || typeof address === 'string') throw new CanvasError('SERVER_ERROR', 'Could not start the diagram server.');
  state.server = server;
  state.url = `http://127.0.0.1:${address.port}/`;
  return state.url;
}

const session = await joinSession({
  canvases: declaration.canvases.map(canvas => createCanvas({
    ...canvas,
    actions: canvas.actions.map(action => ({
      ...action,
      handler: actionHandlers[action.name],
    })),
    open: async ({ instanceId }) => startServer(instanceId),
    onClose: async ({ instanceId }) => {
      const state = instances.get(instanceId);
      if (!state?.server) return;
      await new Promise(resolve => state.server.close(resolve));
      instances.delete(instanceId);
    },
  })),
});
