import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../hooks/auth.hook.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', authController.login.bind(authController));
  fastify.get('/me', { preHandler: [authenticate] }, authController.getMe.bind(authController));
}

