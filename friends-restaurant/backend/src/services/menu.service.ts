import { prisma } from '../config/database.js';
import {
  CreateMenuItemInput,
  UpdateMenuItemInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  ServiceRequestInput,
} from '../types/index.js';

export class MenuService {
  /**
   * Get full menu grouped by category (for public QR code customer view)
   */
  async getFullMenu() {
    return prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          orderBy: [
            { sortOrder: 'asc' },
            { name: 'asc' },
          ],
        },
      },
    });
  }

  /**
   * Get all items (flat list for admin table or customer search)
   */
  async getAllItems(search?: string, categoryId?: string) {
    const where: any = {};

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    return prisma.menuItem.findMany({
      where,
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async getItemById(id: string) {
    return prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async createItem(data: CreateMenuItemInput) {
    return prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price !== undefined ? data.price : null,
        categoryId: data.categoryId,
        image: data.image,
        isAvailable: data.isAvailable ?? true,
        tags: data.tags,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { category: true },
    });
  }

  async updateItem(id: string, data: UpdateMenuItemInput) {
    return prisma.menuItem.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
      include: { category: true },
    });
  }

  async deleteItem(id: string) {
    return prisma.menuItem.delete({
      where: { id },
    });
  }

  async toggleItemStatus(id: string, isAvailable?: boolean) {
    if (isAvailable !== undefined) {
      return prisma.menuItem.update({
        where: { id },
        data: { isAvailable },
      });
    }

    const existing = await prisma.menuItem.findUnique({
      where: { id },
      select: { isAvailable: true },
    });

    if (!existing) {
      throw new Error('Menu item not found');
    }

    return prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !existing.isAvailable },
    });
  }

  // Category management
  async getAllCategories(parentCategory?: string) {
    const where: any = {};
    if (parentCategory && parentCategory !== 'all') {
      where.parentCategory = parentCategory.toUpperCase();
    }

    return prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
  }

  async createCategory(data: CreateCategoryInput) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        parentCategory: data.parentCategory ? data.parentCategory.toUpperCase() : 'FOOD',
        icon: data.icon,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    const updateData: any = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (data.parentCategory) {
      updateData.parentCategory = data.parentCategory.toUpperCase();
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }

  async reorderCategories(orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { sortOrder: index },
      })
    );
    return prisma.$transaction(updates);
  }

  // Service Requests
  async createServiceRequest(data: ServiceRequestInput) {
    return prisma.serviceRequest.create({
      data: {
        tableNumber: data.tableNumber,
        type: data.type,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      },
    });
  }

  async getActiveServiceRequests() {
    return prisma.serviceRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async resolveServiceRequest(id: string) {
    return prisma.serviceRequest.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}

export const menuService = new MenuService();

