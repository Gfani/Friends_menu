import { FastifyInstance } from 'fastify';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../hooks/auth.hook.js';

export async function analyticsRoutes(fastify: FastifyInstance) {
  // Public endpoint for customer menu events
  fastify.post('/track', analyticsController.trackEvent.bind(analyticsController));

  // Protected endpoint for Admin Dashboard insights
  fastify.get('/summary', { preHandler: [authenticate] }, analyticsController.getSummary.bind(analyticsController));
}
