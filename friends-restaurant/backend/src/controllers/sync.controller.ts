import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/database.js';

export class SyncController {
  /**
   * Pull latest menu, categories, and site settings from a remote Cloud server
   * and update the local SQLite database.
   */
  async pullFromCloud(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sourceUrl } = (request.body || {}) as { sourceUrl?: string };
      const targetBase = (sourceUrl || process.env.CLOUD_MENU_URL || '').trim().replace(/\/$/, '');

      if (!targetBase) {
        return reply.status(400).send({
          success: false,
          error: 'Cloud URL is required. Provide sourceUrl or set CLOUD_MENU_URL.',
        });
      }

      // Fetch menu and settings from the Cloud server
      const [menuRes, settingsRes] = await Promise.all([
        fetch(`${targetBase}/api/menu`),
        fetch(`${targetBase}/api/settings`).catch(() => null),
      ]);

      if (!menuRes.ok) {
        return reply.status(502).send({
          success: false,
          error: `Failed to fetch menu from cloud (${menuRes.status} ${menuRes.statusText})`,
        });
      }

      const menuData = (await menuRes.json()) as { success: boolean; data: any[] };
      const categories = menuData.data || [];

      let updatedCategories = 0;
      let updatedItems = 0;

      // Sync categories and items in database
      for (const cat of categories) {
        const categoryRecord = await prisma.category.upsert({
          where: { name: cat.name },
          update: {
            slug: cat.slug,
            description: cat.description,
            parentCategory: cat.parentCategory || 'FOOD',
            sortOrder: cat.sortOrder ?? 0,
            icon: cat.icon,
          },
          create: {
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: cat.description,
            parentCategory: cat.parentCategory || 'FOOD',
            sortOrder: cat.sortOrder ?? 0,
            icon: cat.icon,
          },
        });
        updatedCategories++;

        if (Array.isArray(cat.items)) {
          for (const item of cat.items) {
            // Find existing by ID or Name
            const existing = await prisma.menuItem.findFirst({
              where: {
                OR: [{ id: item.id }, { name: item.name }],
              },
            });

            if (existing) {
              await prisma.menuItem.update({
                where: { id: existing.id },
                data: {
                  name: item.name,
                  price: item.price !== undefined ? item.price : existing.price,
                  description: item.description,
                  image: item.image,
                  isAvailable: item.isAvailable ?? true,
                  tags: item.tags,
                  sortOrder: item.sortOrder ?? 0,
                  categoryId: categoryRecord.id,
                },
              });
            } else {
              await prisma.menuItem.create({
                data: {
                  name: item.name,
                  price: item.price,
                  description: item.description,
                  image: item.image,
                  isAvailable: item.isAvailable ?? true,
                  tags: item.tags,
                  sortOrder: item.sortOrder ?? 0,
                  categoryId: categoryRecord.id,
                },
              });
            }
            updatedItems++;
          }
        }
      }

      // Sync Site Settings if available
      if (settingsRes && settingsRes.ok) {
        try {
          const settingsJson = (await settingsRes.json()) as { success: boolean; data: any };
          if (settingsJson?.data) {
            const s = settingsJson.data;
            delete s.id;
            delete s.updatedAt;
            await prisma.siteSetting.upsert({
              where: { id: 'default' },
              update: s,
              create: { id: 'default', ...s },
            });
          }
        } catch {
          // Non-fatal if settings sync skipped
        }
      }

      return reply.send({
        success: true,
        message: `Successfully synchronized ${updatedCategories} categories and ${updatedItems} dishes from Cloud!`,
        data: {
          updatedCategories,
          updatedItems,
          syncedAt: new Date().toISOString(),
          source: targetBase,
        },
      });
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: err.message || 'Cloud sync failed',
      });
    }
  }
}

export const syncController = new SyncController();

