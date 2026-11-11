import { FastifyInstance } from 'fastify';
import { menuController } from '../controllers/menu.controller.js';
import { authenticate } from '../hooks/auth.hook.js';

export async function menuRoutes(fastify: FastifyInstance) {
  // Public customer routes
  fastify.get('/menu', menuController.getMenu.bind(menuController));
  fastify.get('/menu/items', menuController.getItems.bind(menuController));
  fastify.get('/menu/items/:id', menuController.getItem.bind(menuController));
  fastify.get('/categories', menuController.getCategories.bind(menuController));

  // Admin protected routes for menu items
  fastify.post('/menu/items', { preHandler: [authenticate] }, menuController.createItem.bind(menuController));
  fastify.put('/menu/items/:id', { preHandler: [authenticate] }, menuController.updateItem.bind(menuController));
  fastify.delete('/menu/items/:id', { preHandler: [authenticate] }, menuController.deleteItem.bind(menuController));
  fastify.patch('/menu/items/:id/status', { preHandler: [authenticate] }, menuController.toggleStatus.bind(menuController));

  // Admin protected routes for categories
  fastify.post('/categories', { preHandler: [authenticate] }, menuController.createCategory.bind(menuController));
  fastify.put('/categories/reorder', { preHandler: [authenticate] }, menuController.reorderCategories.bind(menuController));
  fastify.put('/categories/:id', { preHandler: [authenticate] }, menuController.updateCategory.bind(menuController));
  fastify.delete('/categories/:id', { preHandler: [authenticate] }, menuController.deleteCategory.bind(menuController));
}

