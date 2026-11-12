import { FastifyInstance } from 'fastify';
import { syncController } from '../controllers/sync.controller.js';
import { authenticate } from '../hooks/auth.hook.js';

export async function syncRoutes(fastify: FastifyInstance) {
  // Sync menu from Cloud (available to admin or local batch script)
  fastify.post('/sync/pull', syncController.pullFromCloud.bind(syncController));
}

