import { FastifyInstance } from 'fastify';
import { settingsController } from '../controllers/settings.controller.js';
import { authenticate } from '../hooks/auth.hook.js';

export async function settingsRoutes(fastify: FastifyInstance) {
  // Public route to fetch settings for customer page
  fastify.get('/settings', settingsController.getSettings.bind(settingsController));

  // Protected admin routes to update or restore settings
  fastify.put('/settings', { preHandler: [authenticate] }, settingsController.updateSettings.bind(settingsController));
  fastify.post('/settings/reset', { preHandler: [authenticate] }, settingsController.resetSettings.bind(settingsController));
}

