import { FastifyReply, FastifyRequest } from 'fastify';
import { menuService } from '../services/menu.service.js';
import { storageService } from '../services/storage.service.js';

export class MenuController {
  // Public Menu
  async getMenu(request: FastifyRequest, reply: FastifyReply) {
    try {
      const menu = await menuService.getFullMenu();
      return reply.send({
        success: true,
        data: menu,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch menu',
      });
    }
  }

  // Get items list with optional filter
  async getItems(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { search, categoryId } = request.query as { search?: string; categoryId?: string };
      const items = await menuService.getAllItems(search, categoryId);
      return reply.send({
        success: true,
        data: items,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch menu items',
      });
    }
  }

  async getItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const item = await menuService.getItemById(id);
      if (!item) {
        return reply.status(404).send({
          success: false,
          error: 'Menu item not found',
        });
      }
      return reply.send({
        success: true,
        data: item,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch item',
      });
    }
  }

  // Create dish (supports multipart or JSON)
  async createItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      let name = '';
      let description = '';
      let price: number | null = null;
      let categoryId = '';
      let image: string | undefined = undefined;
      let tags = '';
      let isAvailable = true;
      let sortOrder = 0;

      if (request.isMultipart()) {
        const parts = request.parts();
        for await (const part of parts) {
          if (part.type === 'file') {
            if (part.fieldname === 'image' && part.filename) {
              image = await storageService.saveFile(part);
            } else {
              await part.toBuffer();
            }
          } else {
            const val = part.value as string;
            if (part.fieldname === 'name') name = val;
            else if (part.fieldname === 'description') description = val;
            else if (part.fieldname === 'price') {
              price = val && val.trim() !== '' && val !== 'null' ? parseFloat(val) : null;
            } else if (part.fieldname === 'categoryId') categoryId = val;
            else if (part.fieldname === 'tags') tags = val;
            else if (part.fieldname === 'imageUrl' && !image) image = val;
            else if (part.fieldname === 'isAvailable') isAvailable = val === 'true';
            else if (part.fieldname === 'sortOrder') sortOrder = parseInt(val, 10) || 0;
          }
        }
      } else {
        const body = request.body as any;
        name = body?.name;
        description = body?.description || '';
        price = body?.price !== undefined && body?.price !== null && body?.price !== '' ? Number(body.price) : null;
        categoryId = body?.categoryId;
        image = body?.image || body?.imageUrl;
        tags = body?.tags || '';
        isAvailable = body?.isAvailable ?? true;
        sortOrder = body?.sortOrder ? Number(body.sortOrder) : 0;
      }

      if (!name || !categoryId) {
        return reply.status(400).send({
          success: false,
          error: 'Dish name and category are required',
        });
      }

      const newItem = await menuService.createItem({
        name,
        description,
        price,
        categoryId,
        image,
        tags,
        isAvailable,
        sortOrder,
      });

      return reply.status(201).send({
        success: true,
        message: 'Menu item created successfully',
        data: newItem,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to create menu item',
      });
    }
  }

  // Update dish
  async updateItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const existing = await menuService.getItemById(id);
      if (!existing) {
        return reply.status(404).send({
          success: false,
          error: 'Menu item not found',
        });
      }

      const updateData: any = {};

      if (request.isMultipart()) {
        const parts = request.parts();
        for await (const part of parts) {
          if (part.type === 'file') {
            if (part.fieldname === 'image' && part.filename) {
              const uploadedUrl = await storageService.saveFile(part);
              updateData.image = uploadedUrl;
              if (existing.image && existing.image.startsWith('/uploads/')) {
                await storageService.deleteFile(existing.image);
              }
            } else {
              await part.toBuffer();
            }
          } else {
            const val = part.value as string;
            if (part.fieldname === 'name') updateData.name = val;
            else if (part.fieldname === 'description') updateData.description = val;
            else if (part.fieldname === 'price') {
              updateData.price = val && val.trim() !== '' && val !== 'null' ? parseFloat(val) : null;
            } else if (part.fieldname === 'categoryId') updateData.categoryId = val;
            else if (part.fieldname === 'tags') updateData.tags = val;
            else if (part.fieldname === 'imageUrl') updateData.image = val;
            else if (part.fieldname === 'isAvailable') updateData.isAvailable = val === 'true';
            else if (part.fieldname === 'sortOrder') updateData.sortOrder = parseInt(val, 10);
          }
        }
      } else {
        const body = request.body as any;
        if (body.name !== undefined) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.price !== undefined) {
          updateData.price = body.price !== null && body.price !== '' ? Number(body.price) : null;
        }
        if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
        if (body.image !== undefined) updateData.image = body.image;
        if (body.tags !== undefined) updateData.tags = body.tags;
        if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;
        if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);
      }

      const updated = await menuService.updateItem(id, updateData);

      return reply.send({
        success: true,
        message: 'Menu item updated successfully',
        data: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update menu item',
      });
    }
  }

  // Delete dish
  async deleteItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const existing = await menuService.getItemById(id);
      if (!existing) {
        return reply.status(404).send({
          success: false,
          error: 'Menu item not found',
        });
      }

      if (existing.image && existing.image.startsWith('/uploads/')) {
        await storageService.deleteFile(existing.image);
      }

      await menuService.deleteItem(id);

      return reply.send({
        success: true,
        message: 'Menu item deleted successfully',
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to delete menu item',
      });
    }
  }

  // Instant status toggle
  async toggleStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as { isAvailable?: boolean } | undefined;
      const isAvailable = body?.isAvailable;
      const updated = await menuService.toggleItemStatus(id, isAvailable);

      return reply.send({
        success: true,
        message: `Dish is now marked as ${updated.isAvailable ? 'Available' : 'Sold Out'}`,
        data: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update status',
      });
    }
  }

  // Categories
  async getCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { type } = request.query as { type?: string };
      const categories = await menuService.getAllCategories(type);
      return reply.send({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch categories',
      });
    }
  }

  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, description, parentCategory, icon } = request.body as {
        name: string;
        description?: string;
        parentCategory?: string;
        icon?: string;
      };
      if (!name) {
        return reply.status(400).send({
          success: false,
          error: 'Category name is required',
        });
      }

      const category = await menuService.createCategory({ name, description, parentCategory, icon });
      return reply.status(201).send({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to create category',
      });
    }
  }

  async updateCategory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as {
        name?: string;
        description?: string;
        parentCategory?: string;
        icon?: string;
        sortOrder?: number;
      };
      const updated = await menuService.updateCategory(id, body);
      return reply.send({
        success: true,
        message: 'Category updated successfully',
        data: updated,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update category',
      });
    }
  }

  async deleteCategory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await menuService.deleteCategory(id);
      return reply.send({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to delete category',
      });
    }
  }

  async reorderCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { categoryIds } = request.body as { categoryIds: string[] };
      if (!Array.isArray(categoryIds)) {
        return reply.status(400).send({
          success: false,
          error: 'categoryIds array is required',
        });
      }
      await menuService.reorderCategories(categoryIds);
      return reply.send({
        success: true,
        message: 'Categories reordered successfully',
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to reorder categories',
      });
    }
  }
}

export const menuController = new MenuController();
